# Diario Técnico — TFG Instant Love

---

## Entrada 1 — 2026-05-01

### Tarea: Revisión general del Backend (`/server`)

**Archivos revisados:**
- `app.js`, `config/db.js`
- `middlewares/authMiddleware.js`
- `models/`: User, Profile, Subscription, CallHistory, Outcome, Report, index.js
- `controllers/`: authController, profileController, callController, outcomeController, reportController
- `routes/`: todas las rutas

**Nivel de complejidad:** Medio-alto para TFG. La arquitectura MVC con Sequelize, JWT, bcrypt y transacciones de BD está bien planteada. Demuestra comprensión real de cómo funciona una API REST autenticada.

---

### Lo que está bien hecho

- **Transacciones en registro**: `authController.js` usa `sequelize.transaction()` para crear User + Profile + Subscription de forma atómica. Si algo falla, hace rollback. Esto es una buena práctica real.
- **Hash de contraseña con hooks**: El modelo `User.js` usa `beforeCreate` y `beforeUpdate` con bcrypt. La contraseña nunca se guarda en plano.
- **Campo VIRTUAL `es_match`**: En `Outcome.js`, el campo `es_match` es `DataTypes.VIRTUAL` — no crea columna en BD pero calcula el match en tiempo real. Elegante y correcto.
- **Autorización en `finalizarLlamada`**: Verifica que el usuario que llama sea realmente uno de los participantes. Buen control de acceso.
- **Separación de roles**: El middleware `esAdmin` protege correctamente la ruta de obtener reportes.
- **UUID como PK**: Mejor que auto-increment para APIs públicas.
- **try/catch en todos los controladores**: Ninguna promesa queda sin gestionar.

---

### Problemas encontrados

#### CRÍTICO — `{ force: true }` en `app.js`

```js
// app.js línea 25
await sequelize.sync({ force: true });
```

**Problema:** Esto borra y recrea TODAS las tablas cada vez que reinicias el servidor. Destruye todos los datos de la base de datos en cada arranque. Es adecuado solo en el primer setup, nunca en un servidor en uso.

**Solución pendiente:** Cambiar a `{ alter: true }` para desarrollo, o simplemente `sequelize.sync()` para producción.

---

#### CRÍTICO — JWT_SECRET con fallback hardcodeado

```js
// authMiddleware.js línea 18 y authController.js líneas 49, 93
process.env.JWT_SECRET || "clave_secreta_instant_love"
```

**Problema:** Si la variable de entorno no está definida, se usa la cadena `"clave_secreta_instant_love"` que está en el código fuente. Cualquiera que lea el repositorio puede forjar tokens JWT válidos.

**Solución pendiente:** Lanzar un error si `JWT_SECRET` no está definido en `.env`.

---

#### SEGURIDAD MEDIA — Enumeración de usuarios en login

```js
// authController.js líneas 75-87
if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
if (!passwordCorrecta) return res.status(401).json({ message: "Contraseña incorrecta" });
```

**Problema:** Mensajes distintos para email inexistente vs contraseña incorrecta. Un atacante puede saber qué emails están registrados simplemente probando.

**Solución pendiente:** Devolver el mismo mensaje genérico en ambos casos: `"Credenciales incorrectas"`.

---

#### SEGURIDAD MEDIA — Error interno expuesto al cliente

```js
// authController.js línea 66
res.status(500).json({ message: "Error al registrar el usuario", error });
```

**Problema:** Se envía el objeto `error` completo al cliente, que puede incluir stack traces, consultas SQL, estructura de la BD.

**Solución pendiente:** Usar solo `error.message` o no enviar el error al cliente en producción.

---

#### MEDIA — CORS completamente abierto

```js
// app.js línea 14
app.use(cors());
```

**Problema:** Acepta peticiones de cualquier origen. En producción debería restringirse al dominio del frontend.

---

#### MEDIA — Sin protección contra voto doble en `outcomeController.js`

```js
// outcomeController.js líneas 24-29
if (llamada.user1Id === userId) {
  outcome.voto_usuario1 = voto; // Sobreescribe sin verificar si ya votó
}
```

**Problema:** Un usuario puede cambiar su voto después de verlo registrado, o votar múltiples veces. No hay validación de "ya votaste".

**Solución pendiente:** Verificar si el voto ya es distinto de `"PENDIENTE"` antes de actualizar.

---

#### MENOR — Patrón `||` rompe con valores falsy

```js
// profileController.js línea 75
nombre: nombre || perfil.nombre,
// callController.js línea 56
duracion: duracion || llamada.duracion,  // 0 || oldValue = oldValue
```

**Problema:** Si se intenta actualizar `duracion` a `0` o `nombre` a `""`, el `||` devuelve el valor antiguo porque `0` y `""` son falsy en JavaScript.

**Solución pendiente:** Usar operador nullish: `nombre ?? perfil.nombre`.

---

#### MENOR — `PORT` sin valor por defecto

```js
// app.js línea 12
const PORT = process.env.PORT;
```

**Problema:** Si `PORT` no está en `.env`, el servidor escucha en un puerto indefinido sin avisar.

**Solución pendiente:** `const PORT = process.env.PORT || 3001`.

---

#### MENOR — `conectarDB` no para el servidor si falla la BD

```js
// config/db.js líneas 22-24
} catch (error) {
  console.error("No se puede conectar a la base de datos:", error);
}
```

**Problema:** Si la base de datos no está disponible, solo se loguea el error y el servidor sigue arrancando. Todas las peticiones posteriores fallarán.

**Solución pendiente:** Añadir `process.exit(1)` en el catch.

---

#### MENOR — `verPerfilPublico` no filtra campos sensibles

```js
// profileController.js línea 31
const perfil = await Profile.findByPk(id, { ... });
```

**Problema:** La ruta pública devuelve todos los campos del perfil sin filtrar. Debería usar `attributes: [...]` para devolver solo nombre, foto, y genero.

---

### Inconsistencia detectada

En `authController.js` se usa `message` (inglés) mientras que en el resto de controladores se usa `mensaje` (español). Mezcla que puede confundir al frontend.

---

### Decisiones técnicas tomadas hoy

- Revisión inicial en modo lectura completada.
- **Correcciones aplicadas el 2026-05-01:**
  - `app.js`: `{ force: true }` → `{ alter: true }`. Ya no se destruyen los datos al reiniciar.
  - `app.js`: `PORT` ahora tiene fallback a `3001`.
  - `authMiddleware.js`: Eliminado el fallback hardcodeado `"clave_secreta_instant_love"`. Ahora el servidor lanza un error al arrancar si `JWT_SECRET` no está en `.env`.
  - `authController.js`: Eliminados los dos usos del fallback de JWT_SECRET.
- **Pendiente aún:** Enumeración de usuarios en login, error object expuesto al cliente, voto doble, patrón `||` con valores falsy.

---

## Entrada 2 — 2026-05-01

### Tarea: Correcciones de seguridad en `authController.js`

**Archivos modificados:**
- `server/controllers/authController.js`

**Correcciones aplicadas:**

1. **Enumeración de usuarios eliminada** — Las respuestas de "usuario no encontrado" y "contraseña incorrecta" unificadas en un único mensaje `"Credenciales incorrectas"` con código `401`. Ambos casos son ahora indistinguibles para el cliente.

2. **Consistencia de claves en respuestas** — Todas las propiedades `message` (inglés) cambiadas a `mensaje` (español) en todo el archivo. El frontend ahora puede leer siempre `respuesta.mensaje` sin casos especiales.

3. **Error interno ya no se expone** — En el catch de `registrarUsuario`, el objeto `error` completo ha sido sustituido por `error.message`, evitando filtrar stack traces o detalles de la BD al cliente.

**Decisión técnica:** El caso de cuenta desactivada sigue devolviendo un mensaje específico (`"Esta cuenta ha sido desactivada"`) porque no revela si el email existe o no — el usuario ya sabe que su cuenta está desactivada porque se la desactivaron. Es información legítima de dar.

**Pendiente aún:** Patrón `||` con valores falsy en `profileController.js` y `callController.js`.

---

## Entrada 3 — 2026-05-01

### Tarea: Protección contra voto doble en `outcomeController.js`

**Archivos modificados:**
- `server/controllers/outcomeController.js`

**Corrección aplicada:**

Antes de asignar el voto, ahora se comprueba si el campo correspondiente (`voto_usuario1` o `voto_usuario2`) sigue en estado `"PENDIENTE"`. Si ya tiene un valor (`"LIKE"` o `"NEXT"`), se devuelve un `409 Conflict` con el mensaje `"Ya has emitido tu voto para esta llamada."`. Esto impide que un usuario cambie su voto una vez emitido.

**Decisión técnica:** Se usa el código HTTP `409 Conflict` en lugar de `403 Forbidden` porque el problema no es de permisos sino de estado — el recurso ya fue modificado por ese usuario y no se puede volver a modificar.

**Estado del backend:** Todos los problemas críticos y medios identificados en la revisión inicial están corregidos. Solo queda el patrón `||` con valores falsy (menor), que no afecta a la seguridad.

---

## Entrada 4 — 2026-05-01

### Tarea: Arquitectura base del Frontend — Axios y servicio de autenticación

**Contexto:** Inicio del desarrollo del frontend. El backend ya tiene las rutas `POST /api/auth/iniciar-sesion` y `POST /api/auth/registrar` listas para consumir.

**Paquetes instalados:**
- `zod` (validaciones de esquema en cliente)

**Archivos creados:**
- `client/src/biblioteca/api.js`
- `client/src/services/authService.js`

---

### `biblioteca/api.js` — Instancia global de Axios

Configura una instancia de Axios apuntando a `http://localhost:3001/api`. Incluye un interceptor de petición que lee el `token` del `localStorage` antes de cada llamada y, si existe, lo inyecta automáticamente como cabecera `Authorization: Bearer <token>`. Así ningún servicio tiene que preocuparse por el token manualmente.

---

### `services/authService.js` — Servicio de autenticación

Exporta dos funciones:

- **`iniciarSesion(email, password)`**: Valida con Zod que el email tenga formato correcto y la contraseña tenga mínimo 6 caracteres. Si la validación falla, Zod lanza un error antes de hacer ninguna petición. Si pasa, hace `POST /auth/iniciar-sesion` y devuelve `{ mensaje, token, usuario }`.

- **`registrarUsuario(datos)`**: Valida con Zod todos los campos del formulario de registro (email, password, nombre, fecha_nacimiento, genero, preferencia_genero) con las mismas restricciones que el modelo del backend. Si pasa, hace `POST /auth/registrar`.

**Decisión técnica — Zod en el servicio, no en el formulario:** Las validaciones viven en `authService.js` y no en el componente de la página. Esto sigue el principio de que la capa de servicio es quien sabe qué datos acepta la API. El formulario solo mostrará los errores que Zod lance. Separación clara de responsabilidades.

**Decisión técnica — `esquemaLogin.parse()` vs `.safeParse()`:** Se usa `.parse()` porque queremos que la función lance una excepción si los datos son inválidos. El componente que llame al servicio será el responsable de capturar esa excepción en su propio `try/catch` y mostrar el error al usuario.

---

## Entrada 5 — 2026-05-01

### Tarea: Estado global de autenticación con Context API

**Archivos creados:**
- `client/src/context/ProveedorSesion.jsx`
- `client/src/hooks/useSesion.js`

**Archivos modificados:**
- `client/src/main.jsx` — envuelto con `<ProveedorSesion>`

---

### `context/ProveedorSesion.jsx`

Crea el contexto `SesionContext` y el componente `ProveedorSesion`. Estado que gestiona:

| Estado | Valor inicial | Descripción |
|---|---|---|
| `usuario` | `null` | Objeto `{ id, email, rol }` del usuario autenticado |
| `token` | `localStorage.getItem("token")` | Token JWT leído del storage al montar |
| `cargando` | `true` | Indica si aún estamos verificando la sesión al arrancar |

**Funciones expuestas por el contexto:**
- `guardarSesion(datosUsuario, nuevoToken)` — guarda en estado y en `localStorage`.
- `cerrarSesion()` — borra estado y `localStorage`.

**`useEffect` de verificación al inicio:** Cuando la app arranca, si hay un token en `localStorage`, hace `GET /api/perfil/` para validarlo contra el backend. Si el servidor responde con éxito, reconstruye el objeto `usuario` desde la respuesta. Si responde con error (token expirado, inválido), limpia `localStorage` y deja la sesión en `null`. En ambos casos, al terminar pone `cargando: false`.

**Decisión técnica — ¿Por qué validar contra el backend y no decodificar el JWT en cliente?** Decodificar el JWT en cliente (con `atob` o una librería) solo comprueba que el token tiene formato correcto, pero no que siga siendo válido (podría estar en una lista negra o el backend podría haber cambiado el secreto). Llamar a `/perfil/` garantiza que el token es actualmente aceptado por el servidor con un coste mínimo (una petición al arrancar).

**Decisión técnica — ¿Por qué `cargando: true` al inicio?** Las rutas protegidas necesitan saber si la verificación terminó antes de redirigir. Sin este booleano, la app redirige al login en el instante de carga aunque el usuario tenga sesión válida, porque `usuario` aún es `null`.

---

### `hooks/useSesion.js`

Hook personalizado que consume `SesionContext` con `useContext`. Si se usa fuera de `ProveedorSesion`, lanza un error descriptivo para facilitar el debugging. Ningún componente importará `SesionContext` directamente — siempre usarán `useSesion()`.

---

## Entrada 6 — 2026-05-01

### Tarea: Página de Login, gestión unificada de errores y configuración del Router

**Paquetes instalados:**
- `react-router-dom`

**Archivos creados:**
- `client/src/pages/Login.jsx`
- `client/src/pages/Inicio.jsx` (componente temporal para verificar la autenticación)
- `client/src/routes/AppRouter.jsx`

**Archivos modificados:**
- `client/src/App.jsx` — sustituido por `<AppRouter />`

---

### `pages/Login.jsx` — Formulario controlado

Estado local del componente:

| Estado | Propósito |
|---|---|
| `email` | Valor del campo email |
| `password` | Valor del campo contraseña |
| `error` | Mensaje de error a mostrar en pantalla (null si no hay error) |
| `cargando` | Deshabilita el botón mientras se procesa el login |

**Flujo del `handleSubmit`:**
1. Limpia el error anterior y activa `cargando`.
2. Llama a `iniciarSesion(email, password)` del servicio.
3. Si tiene éxito: llama a `guardarSesion(datos.usuario, datos.token)` y redirige a `/` con `useNavigate`.
4. Si falla: el bloque `catch` distingue tres tipos de error:

**Gestión unificada de errores en el `catch`:**
```
err.name === "ZodError"          → error de validación local (Zod)
err.response?.data?.mensaje      → rechazo del backend (Axios)
fallback                         → error inesperado (red, etc.)
```
Un único estado `error` absorbe los tres casos. El formulario siempre muestra el mensaje en `<p style={{ color: "red" }}>`. El usuario nunca ve un error de consola crudo.

**Decisión técnica — `cargando` en el formulario:** El botón se deshabilita mientras la petición está en vuelo para evitar envíos duplicados. Se restaura en el bloque `finally` tanto si hay éxito como si hay error.

---

### `routes/AppRouter.jsx` — Configuración del enrutador

Rutas configuradas:

| Ruta | Componente |
|---|---|
| `/` | `Inicio` (temporal — muestra el email del usuario autenticado) |
| `/login` | `Login` |

`BrowserRouter` vive aquí dentro (no en `main.jsx`) para mantener la responsabilidad del enrutamiento en la carpeta `routes/`. `App.jsx` queda como un simple puente hacia el router.

**Pendiente:** Añadir rutas protegidas (redirigir a `/login` si `usuario` es null) una vez que tengamos más páginas.

---

## Entrada 7 — 2026-05-01

### Tarea: Rutas protegidas y flujo completo de registro

**Archivos creados:**
- `client/src/components/RutaProtegida.jsx`
- `client/src/pages/Registro.jsx`

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx` — ruta `/` envuelta en `<RutaProtegida>`, añadida ruta `/registro`
- `client/src/pages/Login.jsx` — añadido enlace a `/registro`

---

### `components/RutaProtegida.jsx` — Componente contenedor para rutas privadas

Recibe `children` como prop y consulta el contexto de sesión con `useSesion`. Lógica de tres ramas:

```
cargando === true    →  <div>Cargando sesión...</div>
usuario === null     →  <Navigate to="/login" replace />
usuario existe       →  renderiza children
```

**Por qué `replace` en `<Navigate>`:** Sin `replace`, el historial del navegador registra la ruta protegida como una entrada. Cuando el usuario pulsa "atrás" después de ser redirigido al login, volvería a la ruta protegida y sería redirigido de nuevo, creando un bucle confuso. Con `replace`, la entrada en el historial se sustituye por `/login` y el botón "atrás" lleva a donde estaba antes de intentar acceder.

**Por qué no es un HOC (Higher-Order Component) sino un componente contenedor:** Un HOC real devuelve un nuevo componente (`const ConRuta = (Comp) => (props) => ...`). Aquí usamos el patrón más sencillo de componente contenedor con `children`, que es la forma recomendada en React moderno y mucho más legible para un código de TFG.

---

### `pages/Registro.jsx` — Formulario controlado de 6 campos

Estado local con un `useState` por campo: `nombre`, `email`, `password`, `fechaNacimiento`, `genero`, `preferenciaGenero`. Más `error` y `cargando` para el UX.

Los campos `genero` y `preferencia_genero` se implementan como `<select>` con las opciones exactas que acepta el backend (`H`, `M`, `O` / `H`, `M`, `AMBOS`). Esto elimina cualquier posibilidad de enviar un valor no válido al ENUM de la BD.

**Mismo patrón de errores que Login:**
```
ZodError              →  err.errors[0].message
err.response.data.mensaje  →  mensaje del backend
fallback              →  mensaje genérico
```

Al tener éxito, redirige a `/login` (no a `/`) para que el usuario confirme sus credenciales tras el registro. Decisión habitual en apps de producción.

---

### Estado actual de las rutas

| Ruta | Componente | Protegida |
|---|---|---|
| `/` | `Inicio` | Sí — redirige a `/login` si no hay sesión |
| `/login` | `Login` | No |
| `/registro` | `Registro` | No |

**Flujo de autenticación completo:**
`/registro` → crea cuenta → redirige a `/login` → inicia sesión → redirige a `/`

---

## Entrada 8 — 2026-05-01

### Tarea: Dashboard principal y servicio de perfil

**Enfoque:** MVP — lógica de negocio primero, estilos al final.

**Archivos creados:**
- `client/src/services/profileService.js`

**Archivos modificados:**
- `client/src/pages/Inicio.jsx` — convertido en Dashboard real

---

### `services/profileService.js`

Una sola función `obtenerMiPerfil()` que hace `GET /api/perfil/` usando la instancia `api`. Devuelve directamente `respuesta.data.perfil` para que el componente trabaje con el objeto limpio. El token se inyecta automáticamente por el interceptor de `api.js` — el servicio no sabe nada del token.

---

### `pages/Inicio.jsx` — Dashboard

**Estado local:**

| Estado | Propósito |
|---|---|
| `perfil` | Objeto con los datos del perfil cargado desde la API |
| `error` | Mensaje de error si la carga falla |
| `cargando` | Muestra un texto de espera mientras llega la respuesta |

**`useEffect` de carga inicial:** Al montar el componente, llama a `obtenerMiPerfil()`. Si tiene éxito, guarda el perfil en estado. Si falla, guarda el mensaje de error. En ambos casos, desactiva `cargando`. El array de dependencias está vacío (`[]`) para que solo se ejecute una vez al montar.

**Renderizado condicional en tres fases:**
```
cargando === true  →  "Cargando perfil..."
error !== null     →  mensaje de error
datos cargados     →  Dashboard completo
```

**Mapas de etiquetas:** Los valores del ENUM del backend (`H`, `M`, `AMBOS`) se traducen a texto legible con dos objetos de lookup definidos fuera del componente para que no se recreen en cada render:
```js
const etiquetaGenero = { H: "Hombre", M: "Mujer", O: "Otro" };
const etiquetaPreferencia = { H: "Hombres", M: "Mujeres", AMBOS: "Ambos" };
```

**Botón "Buscar Cita":** Placeholder funcional con `console.log`. Se conectará a la lógica de videollamada con Daily.co en la siguiente fase.

**Botón "Cerrar Sesión":** Llama a `cerrarSesion()` del contexto (limpia estado y localStorage) y acto seguido navega a `/login` con `useNavigate`. Las dos acciones son síncronas: primero limpiamos, luego redirigimos.

**Decisión técnica — ¿Por qué no leer el nombre del contexto de sesión en vez de llamar a la API?** El contexto solo guarda `{ id, email, rol }` — los datos mínimos del token JWT. El nombre, género y foto viven en la tabla `Profile` del backend y no se incluyen en el token a propósito (los tokens deben ser ligeros y no deben tener datos que puedan cambiar). Por eso el Dashboard necesita su propia llamada al servicio de perfil.

---

## Entrada 9 — 2026-05-01

### Tarea: Sala de espera y servicio de llamadas

**Archivos creados:**
- `client/src/services/callService.js`
- `client/src/pages/SalaEspera.jsx`

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx` — añadida ruta `/sala-espera` (protegida)
- `client/src/pages/Inicio.jsx` — botón "Buscar Cita" navega a `/sala-espera`

---

### Análisis del backend — Gap crítico encontrado

Al revisar `callController.js`, se detectó que el backend **no tiene sistema de emparejamiento**. El endpoint `POST /api/llamadas/` requiere que el frontend ya conozca el `user2Id` de la otra persona, pero no hay ningún mecanismo server-side para encontrar a esa persona.

**Lo que el backend tiene:**
- `POST /api/llamadas/` — crea registro de llamada entre dos usuarios conocidos
- `PUT /api/llamadas/finalizar/:id` — actualiza duración y estado

**Lo que el backend necesita (pendiente de implementar):**
- `POST /api/llamadas/cola` — unirse a la cola de espera de emparejamiento
- `GET /api/llamadas/cola` — comprobar si ya hay pareja encontrada → devuelve `{ llamadaId }` cuando hay match

---

### `services/callService.js`

Cuatro funciones divididas por estado del flujo:

| Función | Endpoint | Estado |
|---|---|---|
| `unirseColaBusqueda()` | `POST /api/llamadas/cola` | Pendiente en backend |
| `comprobarColaBusqueda()` | `GET /api/llamadas/cola` | Pendiente en backend |
| `iniciarLlamada(user2Id)` | `POST /api/llamadas/` | Disponible |
| `finalizarLlamada(id, dur, estado)` | `PUT /api/llamadas/finalizar/:id` | Disponible |

---

### `pages/SalaEspera.jsx` — Polling con limpieza de efecto

**Decisión técnica — Polling vs WebSockets:** Para un TFG, el polling es la solución correcta. Los WebSockets requieren instalar librerías adicionales (`socket.io`) y configuración especial en el servidor. El polling con `setInterval` es predecible, testeable, y demuestra buen manejo de efectos en React. Para una app con pocos usuarios simultáneos (contexto de demo), el coste es despreciable.

**Patrón de `useEffect` con limpieza:**
```js
useEffect(() => {
  let intervalo;

  const iniciarBusqueda = async () => {
    await unirseColaBusqueda();          // 1. Entrar en cola
    intervalo = setInterval(async () => {
      const estado = await comprobarColaBusqueda(); // 2. Preguntar cada 3s
      if (estado.llamadaId) {
        clearInterval(intervalo);        // 3. Si hay pareja → parar
        navegar(`/llamada/${estado.llamadaId}`);
      }
    }, 3000);
  };

  iniciarBusqueda();

  return () => { if (intervalo) clearInterval(intervalo); }; // 4. Limpieza al desmontar
}, [navegar]);
```

El `return` del `useEffect` es la función de limpieza: si el usuario pulsa "Cancelar" antes de encontrar pareja, React llama a `clearInterval` automáticamente al desmontar el componente. Sin esto, el intervalo seguiría ejecutándose en segundo plano incluso después de salir de la página.

**Próximo paso necesario:** ~~Implementar los dos endpoints de cola en `callController.js` del backend~~ — **Completado en Entrada 10.**

---

## Entrada 10 — 2026-05-01

### Tarea: Algoritmo de emparejamiento en memoria (Matchmaking)

**Archivos creados:**
- `server/utils/colaEspera.js`

**Archivos modificados:**
- `server/controllers/callController.js` — añadidas funciones `unirseAColaBusqueda` y `comprobarEstadoCola`
- `server/routes/callRoutes.js` — añadidas rutas `POST /cola` y `GET /cola`

---

### `utils/colaEspera.js` — Cola en memoria

Dos estructuras de datos en módulo:
- `cola` — array de objetos `{ userId, genero, preferencia_genero }`. Representa a los usuarios esperando pareja.
- `resultados` — `Map<userId, llamadaId>`. Almacena los matches ya formados que aún no han sido recogidos por el frontend.

**Algoritmo de compatibilidad:**

```
esCompatible(preferencia, genero):
  AMBOS  → siempre true
  'H'    → true solo si genero === 'H'
  'M'    → true solo si genero === 'M'
```

Un match requiere compatibilidad **mutua**: A debe interesarle el género de B, Y B debe interesarle el género de A. Esto evita matches unilaterales.

Ejemplos:
- Hombre (H) que busca Mujeres (M) + Mujer (M) que busca Hombres (H) → ✅ match
- Hombre (H) que busca Mujeres (M) + Hombre (H) que busca Ambos (AMBOS) → ❌ no match (A no quiere H)
- Usuario Otro (O) + cualquiera que busque AMBOS → ✅ match

---

### Flujo de los dos endpoints

**`POST /api/llamadas/cola` → `unirseAColaBusqueda`:**
1. Comprueba si el usuario ya tiene un match pendiente de recoger → lo devuelve y lo borra.
2. Obtiene el perfil del usuario (genero + preferencia_genero) de la BD.
3. Añade al usuario a la cola (idempotente: si ya estaba, no duplica).
4. Llama a `buscarPareja` para ver si hay alguien compatible ya esperando.
5. Si hay pareja → saca a ambos de la cola, crea `CallHistory` + `Outcome` en BD, guarda el `llamadaId` en `resultados` para la pareja, y devuelve `{ status: 'match_encontrado', llamadaId }` al usuario actual.
6. Si no hay pareja → devuelve `{ status: 'buscando' }`.

**`GET /api/llamadas/cola` → `comprobarEstadoCola`:**
1. Consulta el `Map resultados` con el userId del token.
2. Si hay resultado → lo devuelve y lo borra del Map (consumo único).
3. Si no → devuelve `{ status: 'buscando' }`.

`comprobarEstadoCola` es síncrono (sin `async`) porque solo accede a estructuras en memoria, sin ningún `await`.

---

### Gestión de concurrencia

Node.js es **single-threaded**: el event loop procesa una petición a la vez dentro de un mismo tick síncrono. Esto significa que las operaciones sobre `cola` y `resultados` (que son síncronas: `.find`, `.push`, `.splice`, `.set`, `.get`) nunca se interrumpen entre sí.

El único riesgo teórico sería entre el `buscarPareja` (síncrono) y el `CallHistory.create` (asíncrono con `await`): mientras esperamos la BD, otro request podría leer la cola. Mitigación: se llama a `sacarDeCola` para AMBOS usuarios **antes** del `await CallHistory.create`, por lo que ninguna otra petición los encontrará disponibles en la cola durante la escritura en BD.

**Limitación conocida:** La cola vive en la memoria del proceso. Si el servidor se reinicia, todos los usuarios en espera pierden su posición. Para producción real se usaría Redis, pero para un TFG en demo es completamente suficiente.

---

### Nota para el frontend

El `SalaEspera.jsx` actual descarta la respuesta de `unirseColaBusqueda()`. Si el match es inmediato (dos usuarios entrando al mismo tiempo), la UI tardará hasta 3 segundos en reaccionar (primer tick del polling). Es el comportamiento correcto para un MVP; se puede optimizar leyendo la respuesta del POST si hace falta.

---

## Entrada 11 — 2026-05-01

### Tarea: Pantalla de videollamada con Daily.co

**Paquetes instalados:**
- `@daily-co/daily-js`

**Archivos creados:**
- `client/src/pages/Llamada.jsx`

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx` — añadida ruta `/llamada/:id` (protegida)

---

### `pages/Llamada.jsx` — Ciclo de vida del iframe

El componente usa **dos refs**:
- `contenedorRef` → apunta al `<div>` del DOM donde Daily inyecta su iframe.
- `frameRef` → guarda la instancia del frame de Daily para poder llamar a `.leave()` y `.destroy()` desde fuera del efecto.

**Ciclo de vida completo dentro del `useEffect`:**

```
Montaje:
  DailyIframe.createFrame(contenedorRef.current, opciones)
  frame.join({ url: URL_SALA })
  → Daily crea el iframe dentro del div y conecta al usuario a la sala

Desmontaje (función de limpieza del useEffect):
  frame.leave()   → desconecta al usuario de la sala
  frame.destroy() → elimina el iframe del DOM y libera recursos
```

La limpieza llama a `.leave()` en un `.catch(() => {})` por si el usuario ya había colgado manualmente antes de que React desmonte el componente. Sin el `.catch`, si `.leave()` lanza porque el frame ya está cerrado, el `.finally()` (que llama a `.destroy()`) nunca se ejecutaría, dejando el iframe huérfano en el DOM.

**`showLeaveButton: false`:** Ocultamos el botón de salida nativo de Daily para que el único punto de salida sea nuestro botón "Colgar". Esto garantiza que `finalizarLlamada` siempre se llame al terminar.

---

### Botón "Colgar" — flujo completo

```
1. setColgando(true)       → deshabilita el botón (evita doble clic)
2. frame.leave()           → desconecta del iframe de Daily
3. finalizarLlamada(id)    → registra el fin de la llamada en nuestra BD
4. navegar("/")            → redirige al Dashboard
```

El bloque `try/catch` es importante: si `frame.leave()` o `finalizarLlamada` fallan, el `finally` ejecuta `navegar("/")` igualmente. El usuario nunca queda atrapado en la pantalla de llamada por un error de red.

---

### Nota pendiente — URL de Daily.co

La constante `URL_SALA_DAILY` en `Llamada.jsx` es un placeholder. Para que funcione, Javier necesita:
1. Crear una cuenta en [daily.co](https://www.daily.co/) (plan gratuito disponible).
2. En el dashboard, crear una sala (puede ser con configuración por defecto).
3. Copiar la URL de la sala (formato: `https://<subdominio>.daily.co/<nombre-sala>`).
4. Sustituir el valor de `URL_SALA_DAILY` en `Llamada.jsx`.

**Nota sobre producción real:** En una app en producción, la URL de la sala se generaría dinámicamente en el backend usando la API REST de Daily.co y se devolvería al frontend. Para el TFG/demo, la sala fija es completamente válida ya que todos los usuarios entran en la misma sala temporal.

---

## Entrada 12 — 2026-05-01

### Tarea: Migración de URLs hardcodeadas a variables de entorno

**Archivos creados:**
- `client/.env`

**Archivos modificados:**
- `client/.gitignore` — añadidas líneas `.env` y `.env.*`
- `client/src/biblioteca/api.js` — `baseURL` lee de `import.meta.env.VITE_API_URL`
- `client/src/pages/Llamada.jsx` — `URL_SALA_DAILY` lee de `import.meta.env.VITE_DAILY_ROOM_URL`

---

### Variables definidas en `.env`

```
VITE_API_URL=http://localhost:3001/api
VITE_DAILY_ROOM_URL=poner_aqui_tu_url_de_daily_co
```

**Por qué el prefijo `VITE_`:** Vite solo expone al navegador las variables de entorno que empiezan por `VITE_`. Las que no tienen ese prefijo son invisibles para el código del cliente — una medida de seguridad para que no se filtren accidentalmente variables del servidor (como claves de base de datos) aunque estén en el mismo archivo.

**Por qué `import.meta.env` y no `process.env`:** En entornos de navegador (Vite, ESModules), `process` no existe. `import.meta.env` es el objeto estándar de Vite que reemplaza a `process.env` en el cliente. En el backend (Node.js) sí se usa `process.env`.

---

### `.gitignore` — seguridad de las variables

El `.gitignore` de Vite ya incluía `*.local` (que cubre `.env.local`), pero **no** cubría `.env` directamente. Se han añadido:
```
.env
.env.*
```

`*.env.*` captura además variantes como `.env.production`, `.env.staging`, etc. De esta forma, ningún archivo `.env` puede subirse a GitHub por error.

**Decisión técnica — no se crea `.env.example`:** En proyectos de equipo es buena práctica crear un `.env.example` con las claves vacías para que otros desarrolladores sepan qué variables necesitan configurar. Para un TFG individual, el propio diario cumple esa función documentando qué variables existen y para qué sirven.

---

## Entrada 13 — 2026-05-02

### Tarea: Pantalla de votación post-llamada — cierre del ciclo MVP

**Archivos creados:**
- `client/src/services/outcomeService.js`
- `client/src/pages/Votacion.jsx`

**Archivos modificados:**
- `client/src/pages/Llamada.jsx` — al colgar redirige a `/votacion/${id}` en lugar de `/`
- `client/src/routes/AppRouter.jsx` — añadida ruta `/votacion/:id` (protegida)

---

### Análisis del backend — `PUT /api/voto/:callId`

El endpoint espera `{ voto: 'LIKE' | 'NEXT' }` y devuelve una de dos respuestas:

| Caso | Respuesta |
|---|---|
| Solo un voto emitido aún | `{ match: false, mensaje: "Voto registrado correctamente" }` |
| Ambos votan LIKE | `{ match: true, mensaje: "¡¡¡HAY INSTANT LOVE!!!", contacto: { nombre, red_social_tipo, red_social_usuario, foto } }` |

El campo `es_match` es un campo `VIRTUAL` de Sequelize (no existe en BD) que se recalcula en cada consulta. El backend ya tiene protección contra voto doble (`409 Conflict` si se intenta votar dos veces).

---

### `services/outcomeService.js`

Una función, `enviarVoto(llamadaId, voto)`, que hace `PUT /voto/:llamadaId` con el voto en el body. Devuelve directamente `respuesta.data` con el resultado completo (incluyendo `contacto` si hay match).

---

### `pages/Votacion.jsx` — renderizado condicional en tres fases

**Estado local:**

| Estado | Propósito |
|---|---|
| `resultado` | null hasta votar; luego `{ match, contacto? }` |
| `error` | mensaje de error si falla la petición |
| `votando` | deshabilita ambos botones mientras la petición está en vuelo |

**Tres fases de renderizado:**

```
resultado === null         →  pantalla de votación (dos botones)
resultado.match === true   →  pantalla de "¡¡¡HAY INSTANT LOVE!!!" con datos de contacto
resultado.match === false  →  pantalla de "Gracias, sigue buscando"
```

**Decisión técnica — mostrar los datos de contacto en el frontend:** El backend devuelve `red_social_tipo` y `red_social_usuario` directamente en la respuesta del voto. Esto evita una segunda petición al servidor para obtener el perfil. Es el diseño correcto: el backend sabe en ese momento que hay match y puede incluir la info de contacto en la misma respuesta.

**Los dos botones se deshabilitan con `disabled={votando}`** durante el envío — doble protección junto al `409` del backend.

---

### Ciclo de vida completo del MVP — cerrado

```
/registro → crea cuenta
  → /login → inicia sesión
    → / (Dashboard) → perfil cargado
      → /sala-espera → polling matchmaking
        → /llamada/:id → videollamada Daily.co
          → /votacion/:id → voto LIKE o NEXT
            → match: true  → muestra datos de contacto → /
            → match: false → agradecimiento → /
```

Todos los pasos tienen rutas protegidas, manejo de errores, y están conectados al backend.

---

## Entrada 14 — 2026-05-02

### Tarea: Integración de Tailwind CSS y librería de componentes UI atómicos

**Paquetes instalados:**
- `tailwindcss@3`, `postcss`, `autoprefixer`

**Archivos generados/creados:**
- `client/tailwind.config.js`
- `client/postcss.config.js`
- `client/src/components/ui/BotonPrimario.jsx`
- `client/src/components/ui/InputFormulario.jsx`

**Archivos modificados:**
- `client/src/index.css` — sustituido por las tres directivas `@tailwind`
- `client/src/App.css` — vaciado (estilos de Vite por defecto incompatibles con Tailwind)

---

### Instalación y configuración de Tailwind v3

**Por qué Tailwind v3 y no v4:** La versión 4 de Tailwind (lanzada en 2025) usa un sistema de configuración completamente diferente: no necesita `tailwind.config.js` ni `postcss.config.js`, y se configura vía plugin de Vite. Para un TFG, Tailwind v3 es la versión con más documentación, ejemplos y recursos de aprendizaje disponibles. Es la elección más defendible ante un tribunal.

**`tailwind.config.js` — clave: el campo `content`:**
```js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```
Tailwind escanea en build time todos los archivos que coinciden con estos patrones y elimina las clases CSS no usadas (tree-shaking de CSS). Si este campo estuviera vacío, Tailwind generaría un archivo CSS de ~3MB con todas las clases posibles. Con la configuración correcta, el bundle final de CSS es de unos pocos KB.

**`index.css` — las tres directivas:**
```css
@tailwind base;      /* Preflight: reset CSS normalizado entre navegadores */
@tailwind components; /* Capa para estilos de componentes personalizados */
@tailwind utilities;  /* Las clases utilitarias de Tailwind (flex, p-4, etc.) */
```

El CSS de Vite por defecto se ha eliminado porque entraba en conflicto con el `preflight` de Tailwind (por ejemplo, el `body { display: flex }` de Vite rompía el layout de todas las páginas).

---

### `components/ui/` — Librería de componentes atómicos

**Decisión arquitectónica — separar diseño de lógica:** Los componentes de `ui/` solo se ocupan del aspecto visual. No conocen nada del estado de la app, no llaman a servicios, no importan hooks de negocio. Esto permite:
1. Reutilizarlos en cualquier página sin acoplamiento.
2. Cambiar el diseño de un botón en un solo sitio y que se actualice en toda la app.
3. Un código de páginas más limpio (la lógica de negocio queda visible, sin ruido de clases CSS largas).

**`BotonPrimario.jsx` — tres variantes:**

| Prop `variante` | Uso |
|---|---|
| `primario` (por defecto) | Acción principal (rose/coral) |
| `secundario` | Acción alternativa (borde rose, fondo blanco) |
| `peligro` | Acciones destructivas como "Colgar" (rojo) |

`disabled:opacity-50 disabled:cursor-not-allowed` en Tailwind aplica estilos automáticamente cuando el atributo HTML `disabled` está activo — sin JavaScript adicional.

**`InputFormulario.jsx` — error integrado:**

Recibe una prop `error` (string o null). Si existe, el borde del input se vuelve rojo y se muestra el mensaje debajo. El color de fondo también cambia a `bg-red-50` para reforzar visualmente el estado de error. Todo esto sin estado propio — el componente es completamente controlado por su padre.

**Pendiente:** ~~Aplicar estos componentes en las páginas existentes~~ — **Completado en Entrada 15.**

---

## Entrada 15 — 2026-05-02

### Tarea: Refactorización de las vistas de autenticación con Tailwind y componentes UI

**Archivos creados:**
- `client/src/components/ui/SelectFormulario.jsx`

**Archivos refactorizados:**
- `client/src/pages/Login.jsx`
- `client/src/pages/Registro.jsx`

---

### `SelectFormulario.jsx` — componente atómico para selects

Mismo patrón exacto que `InputFormulario`: label + elemento de control + mensaje de error condicional. Usa `children` para las opciones en lugar de un array de props, lo que permite al padre escribir `<option>` nativas y mantener el control total sobre el contenido sin props adicionales.

---

### Diseño de la tarjeta de autenticación

Ambas páginas comparten la misma estructura visual:

```
min-h-screen flex items-center justify-center    ← centra vertical y horizontalmente
bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50  ← fondo suave temático
  └── w-full max-w-md                            ← responsive: ocupa toda la pantalla en móvil,
        rounded-2xl shadow-xl p-8 bg-white       ← limitado a 448px en escritorio
          └── form flex flex-col gap-5           ← campos apilados con espacio uniforme
```

`max-w-md` es el punto clave del responsive: en pantallas pequeñas el div ocupa el 100% del ancho (`w-full`), pero en pantallas medianas o grandes queda limitado a 448px centrado.

**Consistencia visual:** Las dos páginas usan el mismo gradiente de fondo, la misma forma de tarjeta y el mismo título "Instant Love 💘". El usuario percibe las dos pantallas como parte de la misma app.

---

### Separación de capas lograda

Antes de la refactorización, cada página mezclaba lógica y diseño en el mismo JSX. Tras la refactorización:

| Capa | Responsable |
|---|---|
| Lógica de negocio (estado, peticiones, errores) | La función del componente página |
| Diseño y estructura visual | `BotonPrimario`, `InputFormulario`, `SelectFormulario` |
| Layout de página | Clases Tailwind en el wrapper de la página |

El código de `handleSubmit` en `Login.jsx` no ha cambiado ni una línea — la refactorización fue puramente de la capa JSX hacia abajo. Esto demuestra que la separación es real.

---

## Entrada 16 — 2026-05-02

### Tarea: Refactorización del Dashboard y la Sala de Espera con Tailwind y feedback visual

**Archivos refactorizados:**
- `client/src/pages/Inicio.jsx`
- `client/src/pages/SalaEspera.jsx`

---

### `Inicio.jsx` — Dashboard rediseñado

**Badges de perfil:** Los valores de `genero` y `preferencia_genero` ya no se muestran como texto plano (`<p>Género: Hombre</p>`). Se presentan como etiquetas visuales (`rounded-full`, borde y fondo de color temático), que son un patrón UI común para mostrar atributos de usuario de forma escaneable.

**Jerarquía visual clara:**
```
Nombre (grande, bold, prominente)
  └── Email (pequeño, gris, secundario)
      └── Badges (género + preferencia)
          └── Botón PRIMARIO grande: "💞 Buscar Cita"
          └── Botón SECUNDARIO discreto: "Cerrar Sesión"
```

**`className="py-4 text-lg"`** pasado como prop a `BotonPrimario`: el componente acepta una prop `className` para extensión puntual sin duplicar el componente. Esto es el patrón de "escape hatch" — el diseño base está en el componente, pero el padre puede añadir clases extra cuando necesita variación puntual.

**Estados de carga y error también con Tailwind:** El `if (cargando)` ya no devuelve un `<div>` sin estilos. Devuelve la misma pantalla con gradiente + texto animado (`animate-pulse`), manteniendo coherencia visual incluso en los estados intermedios.

---

### `SalaEspera.jsx` — Feedback visual con animaciones de Tailwind

**Animaciones usadas:**

| Clase Tailwind | Efecto | Uso |
|---|---|---|
| `animate-bounce` | Rebota verticalmente en bucle | El emoji 💘 para transmitir actividad |
| `animate-pulse` | Ciclo fade-in/fade-out de opacidad | Los tres puntos pulsantes de "cargando" |
| `[animation-delay:0.2s]` | Retrasa el inicio de la animación | Decalaje entre puntos para efecto cascada |

Los tres puntos con retraso escalonado (`0s`, `0.2s`, `0.4s`) crean el efecto de "olas" familiar en indicadores de escritura de WhatsApp/iMessage. `[animation-delay:...]` es una clase arbitraria de Tailwind v3: cuando no existe una clase predefinida, se puede usar la sintaxis de corchetes para pasar un valor CSS directamente.

**Decisión técnica — animaciones CSS vs JavaScript:** Tailwind usa animaciones CSS puras (`@keyframes`). No se necesita `useState` ni `setInterval` para el efecto visual. La lógica de polling sigue siendo solo la del `useEffect` que ya teníamos — las animaciones son completamente decorativas y no añaden complejidad al componente.

---

## Entrada 17 — 2026-05-02

### Tarea: Diseño de la pantalla de videollamada y la tarjeta de votación/match

**Archivos refactorizados:**
- `client/src/pages/Llamada.jsx`
- `client/src/pages/Votacion.jsx`

---

### `Llamada.jsx` — Diseño orientado a medios (modo oscuro)

**Por qué fondo oscuro (`bg-slate-900`):** Las pantallas de videollamada usan fondo oscuro por estándar (Zoom, Google Meet, Teams). Un fondo blanco o claro en una pantalla de vídeo crea un contraste agresivo que fatiga la vista. El `slate-900` es más neutro que el negro puro y da una sensación más profesional.

**`aspect-video`:** Es la clase de Tailwind para la relación de aspecto 16:9 (`aspect-ratio: 16/9`). Garantiza que el contenedor del iframe siempre tenga proporción de pantalla de vídeo sin necesidad de calcular alturas en píxeles. En pantallas pequeñas se adapta automáticamente al ancho disponible.

**`overflow-hidden` en el contenedor del iframe:** Daily.co inyecta el iframe con sus propias esquinas. `overflow-hidden` combinado con `rounded-xl` recorta las esquinas del iframe para que respete el borde redondeado del contenedor, logrando un efecto visual limpio.

**Jerarquía del layout:**
```
bg-slate-900 (pantalla completa oscura)
  └── max-w-4xl aspect-video (vídeo, zona principal)
  └── BotonPrimario variante="peligro" (colgar, zona inferior)
```

---

### `Votacion.jsx` — Tres estados con jerarquía visual diferente

El componente tiene tres renders completamente distintos según el estado:

**Estado 1 — Votando (render por defecto):**
- Fondo gradiente suave (mismo que el resto de la app)
- Tarjeta blanca con emoji 🤔 grande para contexto emocional
- Botón LIKE primario (rose) en posición superior — acción positiva destacada
- Botón NEXT secundario (borde, fondo blanco) — acción negativa visualmente subordinada
- El orden y tamaño de los botones guía al usuario inconscientemente

**Estado 2 — Match (`resultado.match === true`):**
- Fondo **completamente diferente**: gradiente vibrante `from-rose-400 via-pink-400 to-orange-300`
- El cambio de fondo es la señal visual principal de que algo especial ha ocurrido
- Tarjeta con emoji 💘 animado (`animate-bounce`)
- Tarjeta de contacto con fondo `bg-rose-50` y borde `border-rose-200` — diferenciada del cuerpo
- Icono de red social mapeado con objeto de lookup: `{ INSTAGRAM: "📸", WHATSAPP: "💬", ... }`

**Estado 3 — No match:**
- Fondo suave (misma paleta que el resto), sin dramatismo
- Emoji 🙂 y texto amable
- El botón dice "Buscar otra cita" (no "Volver al inicio") — invita a reintentar

**Decisión técnica — fondo diferente para el match:** Cambiar el gradiente del fondo en la pantalla de match es más impactante que cambiar solo el contenido de la tarjeta. El usuario ve un cambio total de pantalla, lo que amplifica la sensación de "algo especial ha pasado". Este patrón lo usan apps como Tinder (confetti y pantalla especial para el match).

---

### Estado final del diseño — todas las pantallas completadas

| Pantalla | Fondo | Estilo tarjeta |
|---|---|---|
| Login | Gradiente rosa suave | Blanca, `shadow-xl` |
| Registro | Gradiente rosa suave | Blanca, `shadow-xl` |
| Dashboard | Gradiente rosa suave | Blanca, `shadow-xl` |
| Sala de Espera | Gradiente rosa suave | Blanca, `shadow-xl` + animaciones |
| Llamada | `bg-slate-900` (oscuro) | Sin tarjeta — vídeo a pantalla completa |
| Votación | Gradiente rosa suave | Blanca, `shadow-xl` |
| Match | Gradiente rosa vibrante | Blanca, `shadow-2xl` + 💘 animado |

---

## Entrada 18 — 2026-05-02

### Tarea: Landing Page pública y separación entre escaparate y aplicación

**Archivos creados:**
- `client/src/pages/LandingPage.jsx`

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx` — `/` apunta a `LandingPage`, dashboard movido a `/dashboard`
- `client/src/pages/Login.jsx` — redirección post-login actualizada a `/dashboard`
- `client/src/pages/SalaEspera.jsx` — "Cancelar búsqueda" redirige a `/dashboard`
- `client/src/pages/Votacion.jsx` — "Volver al inicio" y "Buscar otra cita" redirigen a `/dashboard`

---

### Motivación — separar el escaparate de la aplicación

Hasta ahora, la ruta raíz `/` llevaba directamente al Dashboard privado del usuario. Esto tiene dos problemas:

1. **Experiencia de usuario:** Un usuario no registrado que visite la URL raíz ve una pantalla de redirección al login, sin ninguna información sobre qué es la app o por qué debería registrarse.
2. **Arquitectura lógica:** Mezclar la página de marketing (pública) con la aplicación real (privada) en la misma ruta genera confusión tanto en el código como en la mente del usuario.

La solución estándar en cualquier producto web es separar las dos zonas:

```
/           → LandingPage    (pública, sin autenticación requerida)
/dashboard  → Inicio         (privada, protegida por RutaProtegida)
/login      → Login          (pública)
/registro   → Registro       (pública)
```

Esta separación es la misma que usan aplicaciones como Notion, Linear o Figma: la URL raíz es el escaparate para atraer usuarios, y la aplicación real vive en `/app`, `/dashboard` o similar.

---

### Estructura de `LandingPage.jsx`

La landing se divide en cinco secciones claramente diferenciadas:

**1. Navbar fijo (`sticky top-0 z-50`):**

- Logo con texto en gradiente: la técnica requiere aplicar el gradiente al fondo (`bg-gradient-to-r from-rose-500 to-orange-400`) y recortarlo al texto con `bg-clip-text text-transparent`. Sin `text-transparent`, el fondo queda detrás del texto opaco y el gradiente no se ve.
- Efecto glassmorphism: `bg-white/80 backdrop-blur-sm` — fondo blanco con 80% de opacidad y desenfoque del contenido de fondo. Hace el navbar legible sobre cualquier contenido al hacer scroll.
- Enlace interno con `<a href="#como-funciona">` (ancla HTML nativa): no usa React Router porque es navegación dentro de la misma página, no entre rutas.
- Botones con `<Link to="/login">` y `<Link to="/registro">`: sí usan React Router porque navegan a otra ruta.

**2. Hero a dos columnas (responsive):**

```
flex-col lg:flex-row   → apilado en móvil, dos columnas en escritorio ≥1024px
```

- **Columna izquierda:** badge de "app del momento", H1 con parte del texto en gradiente, subtítulo, dos botones de CTA y tres estadísticas ficticias plausibles.
- **Columna derecha:** simulación de dos tarjetas de perfil superpuestas con `rotate-6` y `-rotate-3` y posicionamiento `absolute`. La tarjeta de fondo girada en sentido positivo crea sensación de profundidad. El badge de "¡Instant Love!" usa `animate-bounce` — consistencia con el lenguaje visual de la pantalla de match real.

**3. Sección "Cómo funciona" (fondo blanco):**

Tres pasos numerados en grid de 3 columnas. El cambio de fondo a `bg-white` separa visualmente la sección sin necesitar bordes ni separadores explícitos.

**4. Sección "Características" (vuelta al gradiente):**

Grid de 6 tarjetas con `hover:shadow-md hover:border-rose-200 transition-all` — efecto de elevación suave al pasar el ratón.

**5. CTA final + Footer:**

Repetición del botón de registro. Los usuarios que llegan scrolleando hasta el final ya leyeron toda la propuesta de valor y están más predispuestos a registrarse.

---

### Decisión técnica — `<a href="#seccion">` vs `<Link to="/#seccion">`

Los enlaces del navbar a secciones internas usan `<a href="#como-funciona">` nativo. Si se usara `<Link to="/#como-funciona">`, React Router haría una navegación completa hacia `/` (desmontando y remontando el componente) antes del scroll, lo cual produce un parpadeo innecesario. Con `<a>` nativo el navegador hace el scroll directamente — más eficiente y más predecible.

---

### Estado del árbol de rutas tras esta entrada

```
/             → LandingPage          (pública)
  ├── /login  → Login                (pública)
  ├── /registro → Registro           (pública)
  └── /dashboard → Inicio           (protegida ✓)
        ├── /sala-espera             (protegida ✓)
        ├── /llamada/:id             (protegida ✓)
        └── /votacion/:id           (protegida ✓)
```

**Ciclo de vida del usuario actualizado:**

```
/ (Landing) → /registro → /login → /dashboard → /sala-espera → /llamada/:id → /votacion/:id → /dashboard
```

---

## Entrada 19 — 2026-05-04

### Tarea: Eliminación de la Landing Page — login como puerta de entrada

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx`

**Cambio aplicado:**

La ruta raíz `/` ya no apunta a `LandingPage`. Ahora contiene un `<Navigate to="/login" replace />` que redirige automáticamente al login. El import de `LandingPage` ha sido eliminado.

**Motivación:** El usuario decidió que la app no necesita página de marketing pública. La puerta de entrada directa es el login, lo que simplifica el árbol de rutas y elimina un componente que ya no tiene función.

**Estado del árbol de rutas:**

```
/             → redirige a /login
/login        → Login          (pública)
/registro     → Registro       (pública)
/dashboard    → Inicio         (protegida ✓)
/sala-espera  → SalaEspera     (protegida ✓)
/llamada/:id  → Llamada        (protegida ✓)
/votacion/:id → Votacion       (protegida ✓)
```

**Flujo actualizado:**
```
Entrar a la web → /login → iniciar sesión → /dashboard
```

---

## Entrada 20 — 2026-05-04

### Tarea: Layout de aplicación con Header, Outlet y Footer

**Archivos creados:**
- `client/src/components/layout/AppLayout.jsx`

**Archivos modificados:**
- `client/src/routes/AppRouter.jsx` — rutas con layout en Route anidada, `/dashboard` redirige a `/inicio`
- `client/src/pages/Inicio.jsx` — eliminado el wrapper de pantalla completa y el botón "Cerrar Sesión" (se trasladan al layout)
- `client/src/pages/Login.jsx` — redirección post-login a `/inicio`
- `client/src/pages/SalaEspera.jsx` — "Cancelar" redirige a `/inicio`
- `client/src/pages/Votacion.jsx` — ambos botones de salida redirigen a `/inicio`

---

### `components/layout/AppLayout.jsx`

Componente de layout que envuelve todas las rutas privadas que necesitan estructura de aplicación. Tres zonas:

**Header sticky (`sticky top-0 z-50`):**
- Logo con imagen + texto en gradiente a la izquierda — enlaza a `/inicio`
- Nav central con tres enlaces: `Inicio` (funcional) y `Mis Citas` / `Mi Perfil` (deshabilitados visualmente con `text-gray-300 cursor-not-allowed`, preparados para fases futuras)
- Botón "Cerrar sesión" a la derecha — llama a `cerrarSesion()` del contexto y redirige a `/login`
- `bg-white/80 backdrop-blur-sm` — glassmorphism para que el header sea legible sobre el gradiente de fondo al hacer scroll

**`<main>` central:**
- `flex-1 flex flex-col` para que ocupe todo el espacio vertical disponible entre header y footer
- Renderiza el contenido de la ruta hija mediante `<Outlet />`

**Footer:**
- `bg-white/60` semitransparente, coherente con el header
- Copyright + tres enlaces decorativos (Privacidad, Términos, Contacto)

---

### Cambio en la arquitectura de rutas

**Antes:** cada ruta protegida se envolvía individualmente con `<RutaProtegida>`.

**Ahora:** las rutas que necesitan layout se agrupan en una Route padre:

```jsx
<Route element={<RutaProtegida><AppLayout /></RutaProtegida>}>
  <Route path="/inicio" element={<Inicio />} />
</Route>
```

`RutaProtegida` comprueba la autenticación una sola vez para toda la zona de la app. `AppLayout` renderiza el header+footer y el `<Outlet />` donde React Router inyecta el componente hijo.

**Rutas de pantalla completa (`/sala-espera`, `/llamada/:id`, `/votacion/:id`) siguen sin layout** porque ocupan toda la pantalla por diseño propio. Añadirles header y footer rompería su UX.

**`/dashboard` conserva un `<Navigate to="/inicio" replace />`** para no romper posibles marcadores o referencias antiguas.

---

### `pages/Inicio.jsx` — simplificado

El componente ya no necesita:
- El wrapper `min-h-screen` con gradiente (lo provee `AppLayout`)
- El botón "Cerrar Sesión" (se movió al header del layout)
- El import de `useSesion` (ya no hay lógica de sesión aquí)

Ahora usa `flex-1` para ocupar el espacio que `AppLayout` le cede, manteniendo el centrado vertical de la tarjeta.

---

### Estado del árbol de rutas

```
/             → redirige a /login
/dashboard    → redirige a /inicio

Con AppLayout (header + footer):
  /inicio     → Inicio (protegida ✓)

Sin layout (pantalla completa):
  /sala-espera  → SalaEspera (protegida ✓)
  /llamada/:id  → Llamada    (protegida ✓)
  /votacion/:id → Votacion   (protegida ✓)

Públicas:
  /login      → Login
  /registro   → Registro
```

---
