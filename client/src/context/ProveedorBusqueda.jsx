import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

//Cada cuánto pregunta el frontend al backend si ya hay pareja disponible
const INTERVALO_POLLING_MS = 3000;

const ContextoBusqueda = createContext(null);

const ProveedorBusqueda = ({ children }) => {
  const [mensajeError, setMensajeError] = useState(null);
  const intervaloRef = useRef(null);

  const { ejecutar } = useApi();
  const navegar = useNavigate();

  //Limpia el intervalo de polling para no dejar procesos corriendo en segundo plano
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
    //Paramos cualquier búsqueda anterior antes de empezar una nueva, por si acaso
    pararBusqueda();
    try {
      const resultado = await ejecutar(apiClient.post("/llamadas/cola", {}));
      //Si ya había alguien esperando, el backend nos devuelve la llamada directamente sin polling
      if (resultado?.llamadaId) {
        navegar(`/llamada/${resultado.llamadaId}`);
        return;
      }
      //Si no hay nadie todavía, arrancamos el polling para preguntar cada X segundos
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
