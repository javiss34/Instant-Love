import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Registro from "../pages/Registro.jsx";
import Inicio from "../pages/Inicio.jsx";
import Estadisticas from "../pages/Estadisticas.jsx";
import MiPerfil from "../pages/MiPerfil.jsx";
import SalaEspera from "../pages/SalaEspera.jsx";
import Llamada from "../pages/Llamada.jsx";
import Votacion from "../pages/Votacion.jsx";

const Rutas = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<Inicio/>} />
      <Route path="/estadisticas" element={<Estadisticas/>} />
      <Route path="/mi-perfil" element={<MiPerfil/>} />
      <Route path="/sala-espera" element={<SalaEspera/>} />
      <Route path="/llamada/:id" element={<Llamada/>} />
      <Route path="/votacion/:id" element={<Votacion/>} />
    </Routes>
  );
};
export default Rutas;
