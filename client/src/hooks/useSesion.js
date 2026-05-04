import { useContext } from "react";
import { SesionContext } from "../context/ProveedorSesion.jsx";

const useSesion = () => {
  const contexto = useContext(SesionContext);

  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  }

  return contexto;
};

export default useSesion;
