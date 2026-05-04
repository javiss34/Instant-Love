# Contexto del Proyecto (TFG Fullstack)
Soy un estudiante universitario. Estás trabajando en mi Trabajo de Fin de Grado.
El proyecto está dividido en dos carpetas:
- `/server`: El Backend (ya construido por mí en Node.js, Express y MySQL con Sequelize).
- `/client`: El Frontend (en React). Para las videollamadas usamos Daily.co.

# REGLAS PARA EL FRONTEND (`/client`)
1. Nivel de código: Estudiante de grado superior DAW. Limpio y fácil de defender ante un tribunal. Formularios controlados. Validaciones con Zod.
2. Hooks PERMITIDOS: `useState`, `useEffect`, `useContext`, `useRef` y hooks de React Router.
3. PROHIBIDO: `useMemo`, `useCallback`, `useReducer`, Redux, Zustand o React Query.
4. Arquitectura de carpetas estricta dentro de `/client/src/`:
   - `biblioteca/`: validaciones y utilidades puras.
   - `services/`: Peticiones puras a la API (ej. `authService.js`).
   - `context/`: Proveedores de estado global (`createContext`).
   - `hooks/`: Custom Hooks.
   - `components/`: Vistas reutilizables (`layout`, `menu`).
   - `pages/`: Pantallas completas.
   - `routes/`: Enrutamiento.

# REGLAS PARA EL BACKEND (`/server`)
1. Respeta la estructura actual que ya tengo creada (MVC: models, controllers, routes).
2. Si tienes que modificar algo aquí, hazlo usando el estilo de código existente (Express puro y Sequelize). No introduzcas librerías nuevas sin preguntar.

# GENERAL
- Las variables, funciones y comentarios deben estar en español, con tono natural de estudiante.
- Cuando crees un archivo, asegúrate de ponerlo en la ruta correcta (`/client/src/...` o `/server/...`).