import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

const RutaPrivada = ({ children }) => {
  const { sesionIniciada, cargandoSesion } = useSesion();

  if (cargandoSesion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!sesionIniciada) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaPrivada;
