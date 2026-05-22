# Diario TFG — Instant Love

---

## Refactorización arquitectural: Providers + Custom Hooks + objetoInicial

### Motivación
Se adoptó la arquitectura estricta de clase: separación total entre UI y lógica de negocio. Los componentes de página no contienen llamadas a la API ni lógica pesada. Todo se mueve a Providers y Custom Hooks.

### Nuevos archivos creados

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `context/ProveedorAuth.jsx` | Context Provider | Estado de sesión + funciones `login()`, `registro()`, `cerrarSesion()` |
| `hooks/useAuth.js` | Custom Hook | Acceso al `AuthContext` con guard de error |
| `hooks/useBusqueda.js` | Custom Hook | Polling de matchmaking, navegación automática al match |
| `hooks/useLlamada.js` | Custom Hook | Ciclo de vida del frame Daily.co, `colgar()`, `siguiente()` |

### Backward compatibility
`ProveedorSesion.jsx` y `useSesion.js` re-exportan desde los nuevos archivos. Cualquier componente existente (Header, etc.) sigue funcionando sin cambios.

### Formularios con objetoInicial (Regla 1)
- `Login.jsx`: `const loginInicial = { email: "", password: "" }` — un solo `useState` + `handleChange` genérico con `[e.target.id]`.
- `Registro.jsx`: `const registroInicial = { username, nombre, email, password, fecha_nacimiento, genero, preferencia_genero }` — misma técnica. Los IDs de los inputs coinciden exactamente con las claves del objeto para que `handleChange` funcione sin mapeos extra.

### Páginas refactorizadas (Regla 2)
Cada página queda reducida a pura UI:
- `Login.jsx`: destrucctura `{ login }` de `useAuth()`, llama `await login(formData)`.
- `Registro.jsx`: destrucctura `{ registro }` de `useAuth()`, llama `await registro(formData)`.
- `SalaEspera.jsx`: destrucctura `{ error }` de `useBusqueda()`. Toda la lógica de polling y navegación vive en el hook.
- `Llamada.jsx`: destrucctura `{ contenedorRef, colgando, avisoCamara, colgar, siguiente }` de `useLlamada()`. El componente visual tiene 30 líneas.

### `App.jsx`
Cambiado de `ProveedorSesion` a `ProveedorAuth` como proveedor raíz.

---

## Despliegue a producción en Render

**Estado:** Completado con éxito.

- **Backend** (Node.js/Express): desplegado como Web Service en Render, conectado a base de datos MySQL en Aiven con SSL habilitado (`rejectUnauthorized: false`).
- **Frontend** (React/Vite): desplegado como Static Site en Render con regla de rewrite para SPA (`/* → /index.html`).
- **Variables de entorno** configuradas en ambos servicios: `VITE_API_URL`, `VITE_DAILY_ROOM_URL`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, `CLIENT_URL`.

---

## Corrección del sistema de matchmaking

### El problema

El flujo de emparejamiento fallaba de forma silenciosa para el segundo usuario en unirse a la cola.

La lógica en el servidor es:
1. El primer usuario llama a `POST /api/llamadas/cola` → se añade a la cola en memoria → no hay pareja → responde `{ status: "buscando" }`.
2. El segundo usuario llama a `POST /api/llamadas/cola` → se añade a la cola → encuentra al primero → crea la `CallHistory` en BD → guarda el resultado para el primero en el `Map` de resultados → responde `{ status: "match_encontrado", llamadaId: X }` **directamente al segundo**.

El bug estaba en el frontend (`SalaEspera.jsx`): la respuesta del `POST` inicial era completamente ignorada. El código hacía `await unirseColaBusqueda()` sin leer lo que devolvía, y luego iniciaba el polling con `GET /api/llamadas/cola`. Como el resultado del match ya había sido devuelto en el `POST` y no estaba almacenado en el `Map` para el segundo usuario, el `GET` siempre le devolvía `{ status: "buscando" }` y nunca era redirigido.

El primer usuario sí era redirigido porque su `llamadaId` sí estaba guardado en el `Map` y lo recogía en el polling.

### La corrección

En `client/src/pages/SalaEspera.jsx` se añadió la lectura del resultado del `POST` inicial:

```js
const resultado = await unirseColaBusqueda();

// Si el propio POST ya devuelve un match, navegamos directamente sin esperar el polling
if (resultado.llamadaId) {
  navegar(`/llamada/${resultado.llamadaId}`);
  return;
}

// Si no hay match aún, iniciamos el polling
intervalo = setInterval(...);
```

Con este cambio, el segundo usuario (el que cierra el match) es redirigido inmediatamente al recibir la respuesta del `POST`, y el primero sigue siendo redirigido en el siguiente ciclo de polling.

### Mejora de robustez en videollamada

En `client/src/pages/Llamada.jsx` se añadió:
- Captura del evento `camera-error` de Daily.co para mostrar un aviso sin romper la aplicación.
- `.catch()` en `frame.join()` para el caso en que el dispositivo no tenga cámara o micrófono disponibles.
- Mensaje informativo visible al usuario cuando ocurre el error, permitiéndole continuar en la llamada.

---

## Mejoras UX y campo Username

### 1. Campo username en el registro

Se añadió el campo `username` (único, máx. 30 caracteres, solo letras/números/guiones bajos) a todo el flujo de registro:

- **`server/models/User.js`**: nuevo campo `username` con `unique: true`.
- **`server/controllers/authController.js`**: se extrae `username` del body, se comprueba unicidad antes de crear el usuario, y se devuelve en las respuestas de registro y login.
- **`client/src/services/authService.js`**: añadido al esquema Zod con validación de formato.
- **`client/src/pages/Registro.jsx`**: nuevo campo de input visible en el formulario.
- **`client/src/context/ProveedorSesion.jsx`**: `username` incluido en el objeto `usuario` al verificar la sesión desde el token guardado.

### 2. UX de la videollamada (Daily.co)

Cambios en `client/src/pages/Llamada.jsx`:
- `showPreJoinUI: false` para entrar directamente a la sala sin la pantalla de confirmación.
- `userName: usuario?.username` en el `join()` para que Daily muestre el nombre de usuario real.
- Botones propios superpuestos sobre el iframe con `position: absolute`:
  - **"Siguiente"** → finaliza la llamada y redirige a `/sala-espera` para buscar otro match inmediatamente.
  - **"Colgar"** → finaliza la llamada y redirige a `/votacion` como siempre.

### 3. Bug pantalla blanca al navegar a Votación

**Causa raíz**: `handleColgar` llamaba a `frame.leave()` y luego navegaba, pero el cleanup del `useEffect` también intentaba `leave()` al desmontar el componente. Daily.co lanzaba un error al hacer `leave()` dos veces seguidas, que React no capturaba y dejaba la pantalla en blanco.

**Corrección**: se extrajo una función `destruirFrame()` que hace `leave()` + `destroy()` + `frameRef.current = null`. Al limpiar el ref antes de navegar, el cleanup del `useEffect` ve `null` y no hace nada.

**Extra**: se añadió un guard `if (!id) return <Loading />` en `Votacion.jsx` para proteger el primer render antes de que `useParams` tenga el valor disponible.
