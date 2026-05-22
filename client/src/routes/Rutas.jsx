import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Registro from "../pages/Registro.jsx";
import Inicio from "../pages/Inicio.jsx";
import Estadisticas from "../pages/Estadisticas.jsx";
import MiPerfil from "../pages/MiPerfil.jsx";
import SalaEspera from "../pages/SalaEspera.jsx";
import Llamada from "../pages/Llamada.jsx";
import Votacion from "../pages/Votacion.jsx";
import RutaPrivada from "./RutaPrivada.jsx";

const Rutas = () => {
  return (
    <Routes>
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
            <Estadisticas />
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
            <SalaEspera />
          </RutaPrivada>
        }
      />
      <Route
        path="/llamada/:id"
        element={
          <RutaPrivada>
            <Llamada />
          </RutaPrivada>
        }
      />
      <Route
        path="/votacion/:id"
        element={
          <RutaPrivada>
            <Votacion />
          </RutaPrivada>
        }
      />
    </Routes>
  );
};

export default Rutas;
