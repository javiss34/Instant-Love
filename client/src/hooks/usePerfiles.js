import { useContext } from "react";
import { ContextoPerfiles } from "../context/ProveedorPerfiles.jsx";

const usePerfiles = () => {
  const contexto = useContext(ContextoPerfiles);
  if (!contexto) {
    throw new Error("usePerfiles debe usarse dentro de <ProveedorPerfiles>");
  }
  return contexto;
};

export default usePerfiles;
