import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

//Componente que protege las rutas privadas.
//Recibe children, que es el componente que el usuario intenta ver
const RutaPrivada = ({ children }) => {
  const { sesionIniciada, cargandoSesion } = useSesion();

  if (cargandoSesion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  //Si no tiene la sesión iniciada lo expulsamos al login con Navigate.
  if (!sesionIniciada) {
    return <Navigate to="/login" replace />;//Usamos replace para no ensuciar el historial del navegador
  }

  //Si tiene sesión devolvemos el contenido.
  return children;
};

export default RutaPrivada;
