import { createContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoEstadisticas = createContext(null);

const ProveedorEstadisticas = ({ children }) => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { ejecutar } = useApi();

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await ejecutar(apiClient.get("/estadisticas"));
        setEstadisticas(datos);
      } catch {
        // silencioso
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <ContextoEstadisticas.Provider value={{ estadisticas, cargando }}>
      {children}
    </ContextoEstadisticas.Provider>
  );
};

export default ProveedorEstadisticas;
export { ContextoEstadisticas };
