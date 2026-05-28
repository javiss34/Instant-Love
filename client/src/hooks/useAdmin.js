import { useContext } from "react";
import { ContextoAdmin } from "../context/ProveedorAdmin.jsx";

const useAdmin = () => {
  const contexto = useContext(ContextoAdmin);
  if (!contexto) throw new Error("useAdmin debe usarse dentro de ProveedorAdmin");
  return contexto;
};

export default useAdmin;
