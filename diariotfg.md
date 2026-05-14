# Diario TFG — Instant Love

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
