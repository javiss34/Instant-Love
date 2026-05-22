import { createContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";
import useSesion from "../hooks/useSesion.js";

const ContextoPerfiles = createContext(null);

const ProveedorPerfiles = ({ children }) => {
  const perfilInicial = null;
  const [perfilPropio, setPerfilPropio] = useState(perfilInicial);

  const { sesionIniciada } = useSesion();
  const { ejecutar, cargando, error } = useApi();

  const obtenerPerfilPropio = async () => {
    const respuesta = await ejecutar(apiClient.get("/perfil/"));
    if (respuesta?.perfil) {
      setPerfilPropio(respuesta.perfil);
    }
  };

  const actualizarPerfilPropio = async (datos) => {
    const respuesta = await ejecutar(apiClient.put("/perfil/", datos));
    if (respuesta?.perfil) {
      setPerfilPropio(respuesta.perfil);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (sesionIniciada) {
      obtenerPerfilPropio();
    } else {
      setPerfilPropio(perfilInicial);
    }
  }, [sesionIniciada]);

  const datosAProveer = {
    perfilPropio,
    cargando,
    error,
    obtenerPerfilPropio,
    actualizarPerfilPropio,
  };

  return (
    <ContextoPerfiles.Provider value={datosAProveer}>
      {children}
    </ContextoPerfiles.Provider>
  );
};

export default ProveedorPerfiles;
export { ContextoPerfiles };
