import { useContext } from "react";
import { ContextoEstadisticas } from "../context/ProveedorEstadisticas.jsx";

const useEstadisticas = () => {
  const contexto = useContext(ContextoEstadisticas);
  if (!contexto) {
    throw new Error("useEstadisticas debe usarse dentro de <ProveedorEstadisticas>");
  }
  return contexto;
};

export default useEstadisticas;
