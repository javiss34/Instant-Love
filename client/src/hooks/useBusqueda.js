import { useContext } from "react";
import { ContextoBusqueda } from "../context/ProveedorBusqueda.jsx";

const useBusqueda = () => {
  const contexto = useContext(ContextoBusqueda);
  if (!contexto) {
    throw new Error("useBusqueda debe usarse dentro de <ProveedorBusqueda>");
  }
  return contexto;
};

export default useBusqueda;
