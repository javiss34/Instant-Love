import { useContext } from "react";
import { AuthContext } from "../context/ProveedorAuth.jsx";

const useAuth = () => {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de ProveedorAuth");
  }

  return contexto;
};

export default useAuth;
