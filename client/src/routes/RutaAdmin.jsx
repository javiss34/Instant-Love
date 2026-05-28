import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

const RutaAdmin = ({ children }) => {
  const { sesionIniciada, cargandoSesion, usuario } = useSesion();

  if (cargandoSesion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!sesionIniciada || usuario?.rol !== "ADMIN") {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default RutaAdmin;
