import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;

const ContextoVideollamada = createContext(null);

const ProveedorVideollamada = ({ children }) => {
  const [avisoCamara, setAvisoCamara] = useState(false);
  const [colgando, setColgando] = useState(false);
  const frameRef = useRef(null);

  const { ejecutar } = useApi();
  const navegar = useNavigate();

  const unirseASala = (contenedor, usuario) => {
    if (!contenedor || frameRef.current) return;
    setAvisoCamara(false);

    const frame = DailyIframe.createFrame(contenedor, {
      iframeStyle: { width: "100%", height: "100%", border: "none" },
      showLeaveButton: false,
      showFullscreenButton: false,
      showPreJoinUI: false,
    });
    frameRef.current = frame;

    frame.on("camera-error", () => setAvisoCamara(true));

    frame
      .join({ url: URL_SALA_DAILY, userName: usuario?.username })
      .catch(() => setAvisoCamara(true));
  };

  const destruirFrame = async () => {
    if (!frameRef.current) return;
    await frameRef.current.leave().catch(() => {});
    frameRef.current.destroy();
    frameRef.current = null;
  };

  const salir = async () => {
    await destruirFrame();
  };

  const finalizarYNavegar = async (idLlamada, destino) => {
    setColgando(true);
    try {
      await destruirFrame();
      await ejecutar(
        apiClient.put(`/llamadas/finalizar/${idLlamada}`, {
          duracion: 0,
          estado: "COMPLETADA",
        }),
      );
    } catch {
      // seguimos navegando para no dejar al usuario atrapado
    } finally {
      navegar(destino);
      setColgando(false);
    }
  };

  const colgar = (idLlamada) =>
    finalizarYNavegar(idLlamada, `/votacion/${idLlamada}`);
  const siguiente = (idLlamada) => finalizarYNavegar(idLlamada, "/sala-espera");

  const votar = async (idLlamada, voto) => {
    return await ejecutar(apiClient.put(`/voto/${idLlamada}`, { voto }));
  };

  const datosAProveer = {
    avisoCamara,
    colgando,
    unirseASala,
    salir,
    colgar,
    siguiente,
    votar,
  };

  return (
    <ContextoVideollamada.Provider value={datosAProveer}>
      {children}
    </ContextoVideollamada.Provider>
  );
};

export default ProveedorVideollamada;
export { ContextoVideollamada };
