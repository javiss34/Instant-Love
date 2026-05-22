import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unirseColaBusqueda, comprobarColaBusqueda } from "../services/callService.js";

const INTERVALO_POLLING_MS = 3000;

const useBusqueda = () => {
  const [error, setError] = useState(null);
  const navegar = useNavigate();

  useEffect(() => {
    let intervalo;

    const iniciarBusqueda = async () => {
      try {
        const resultado = await unirseColaBusqueda();

        if (resultado.llamadaId) {
          navegar(`/llamada/${resultado.llamadaId}`);
          return;
        }

        intervalo = setInterval(async () => {
          try {
            const estado = await comprobarColaBusqueda();
            if (estado.llamadaId) {
              clearInterval(intervalo);
              navegar(`/llamada/${estado.llamadaId}`);
            }
          } catch {
            clearInterval(intervalo);
            setError("Error al comprobar el estado de la búsqueda.");
          }
        }, INTERVALO_POLLING_MS);

      } catch {
        setError("No se pudo unirse a la cola de búsqueda. Inténtalo de nuevo.");
      }
    };

    iniciarBusqueda();
    return () => { if (intervalo) clearInterval(intervalo); };
  }, [navegar]);

  return { error };
};

export default useBusqueda;
