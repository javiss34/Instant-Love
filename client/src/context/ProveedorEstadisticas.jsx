import { createContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoEstadisticas = createContext(null);

const ProveedorEstadisticas = ({ children }) => {
  const [estadisticas, setEstadisticas] = useState(null);
  const { ejecutar, cargando } = useApi();

  const obtenerEstadisticas = async () => {
    const datos = await ejecutar(apiClient.get("/estadisticas"));
    if (datos) setEstadisticas(datos);
  };

  useEffect(() => {
    obtenerEstadisticas();
  }, []);

  const datosAProveer = { estadisticas, cargando, obtenerEstadisticas };

  return (
    <ContextoEstadisticas.Provider value={datosAProveer}>
      {children}
    </ContextoEstadisticas.Provider>
  );
};

export default ProveedorEstadisticas;
export { ContextoEstadisticas };
