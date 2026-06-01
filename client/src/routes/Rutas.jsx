import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Registro from "../pages/Registro.jsx";
import Inicio from "../pages/Inicio.jsx";
import Estadisticas from "../pages/Estadisticas.jsx";
import MiPerfil from "../pages/MiPerfil.jsx";
import SalaEspera from "../pages/SalaEspera.jsx";
import Llamada from "../pages/Llamada.jsx";
import Votacion from "../pages/Votacion.jsx";
import PanelAdmin from "../pages/PanelAdmin.jsx";
import DetalleUsuario from "../pages/DetalleUsuario.jsx";
import RutaPrivada from "./RutaPrivada.jsx";
import RutaAdmin from "./RutaAdmin.jsx";
import ProveedorEstadisticas from "../context/ProveedorEstadisticas.jsx";
import ProveedorBusqueda from "../context/ProveedorBusqueda.jsx";
import ProveedorVideollamada from "../context/ProveedorVideollamada.jsx";

/* En vez de envolver en App.jsx las header,rutas y footer con todos los proveedores,
los envolvemos únicamente en las rutas que necesitan.
De esta forma evitamos el consumo de memoria y peticiones innecesarias a la API cuando el
usuario navega por otras secciones */
const Rutas = () => {
  return (
    <Routes>
      {/* Hemos usado el componente <Navigate> en vez del hook useNavigate() que era el que usabamos en clase
      porque para este caso se recomienda usar <Navigate> para fases de renderizado, además, el atributo replace
      evita que esa redirección se guarde en el historial del navegador, evitando bucles al usar el botón para ir atrás.  */}
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/inicio"
        element={
          <RutaPrivada>
            <Inicio />
          </RutaPrivada>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <RutaPrivada>
            <ProveedorEstadisticas>
              <Estadisticas />
            </ProveedorEstadisticas>
          </RutaPrivada>
        }
      />
      <Route
        path="/mi-perfil"
        element={
          <RutaPrivada>
            <MiPerfil />
          </RutaPrivada>
        }
      />
      <Route
        path="/sala-espera"
        element={
          <RutaPrivada>
            <ProveedorBusqueda>
              <SalaEspera />
            </ProveedorBusqueda>
          </RutaPrivada>
        }
      />
      <Route
        path="/llamada/:id"
        element={
          <RutaPrivada>
            <ProveedorVideollamada>
              <Llamada />
            </ProveedorVideollamada>
          </RutaPrivada>
        }
      />
      <Route
        path="/votacion/:id"
        element={
          <RutaPrivada>
            <ProveedorVideollamada>
              <Votacion />
            </ProveedorVideollamada>
          </RutaPrivada>
        }
      />
      <Route
        path="/admin"
        element={
          <RutaAdmin>
            <PanelAdmin />
          </RutaAdmin>
        }
      />
      <Route
        path="/admin/usuarios/:id"
        element={
          <RutaAdmin>
            <DetalleUsuario />
          </RutaAdmin>
        }
      />
    </Routes>
  );
};

export default Rutas;
