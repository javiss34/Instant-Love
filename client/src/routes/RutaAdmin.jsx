import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import ProveedorAdmin from "../context/ProveedorAdmin.jsx";

/* Componente que portege las vistas de ADMIN */
const RutaAdmin = ({ children }) => {
  const { sesionIniciada, cargandoSesion, usuario } = useSesion();

  if (cargandoSesion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  //A parte de comprobar que tiene la sesión iniciada tambien comrpueba que es ADMIN
  if (!sesionIniciada || usuario?.rol !== "ADMIN") {
    return <Navigate to="/inicio" replace />;
  }

  return <ProveedorAdmin>{children}</ProveedorAdmin>;
};

export default RutaAdmin;
