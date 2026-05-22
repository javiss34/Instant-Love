import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const INTERVALO_POLLING_MS = 3000;

const ContextoBusqueda = createContext(null);

const ProveedorBusqueda = ({ children }) => {
  const [mensajeError, setMensajeError] = useState(null);
  const intervaloRef = useRef(null);

  const { ejecutar } = useApi();
  const navegar = useNavigate();

  const pararBusqueda = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const comprobarCola = async () => {
    try {
      const resultado = await ejecutar(apiClient.get("/llamadas/cola"));
      if (resultado?.llamadaId) {
        pararBusqueda();
        navegar(`/llamada/${resultado.llamadaId}`);
      }
    } catch {
      pararBusqueda();
      setMensajeError("Error al comprobar el estado de la búsqueda.");
    }
  };

  const iniciarBusqueda = async () => {
    setMensajeError(null);
    pararBusqueda();
    try {
      const resultado = await ejecutar(apiClient.post("/llamadas/cola", {}));
      if (resultado?.llamadaId) {
        navegar(`/llamada/${resultado.llamadaId}`);
        return;
      }
      intervaloRef.current = setInterval(comprobarCola, INTERVALO_POLLING_MS);
    } catch {
      setMensajeError(
        "No se pudo unirse a la cola de búsqueda. Inténtalo de nuevo.",
      );
    }
  };

  const datosAProveer = {
    mensajeError,
    iniciarBusqueda,
    pararBusqueda,
  };

  return (
    <ContextoBusqueda.Provider value={datosAProveer}>
      {children}
    </ContextoBusqueda.Provider>
  );
};

export default ProveedorBusqueda;
export { ContextoBusqueda };
