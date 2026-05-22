import { useContext } from "react";
import { ContextoVideollamada } from "../context/ProveedorVideollamada.jsx";

const useVideollamada = () => {
  const contexto = useContext(ContextoVideollamada);
  if (!contexto) {
    throw new Error(
      "useVideollamada debe usarse dentro de <ProveedorVideollamada>",
    );
  }
  return contexto;
};

export default useVideollamada;
