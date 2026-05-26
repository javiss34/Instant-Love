import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;
const DURACION_LLAMADA_SEGUNDOS = 120;
const modalInicial = { visible: false, idLlamada: null, accion: null };

const ContextoVideollamada = createContext(null);

const ProveedorVideollamada = ({ children }) => {
  const [avisoCamara, setAvisoCamara] = useState(false);
  const [colgando, setColgando] = useState(false);
  const [modal, setModal] = useState(modalInicial);
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_LLAMADA_SEGUNDOS);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  const frameRef = useRef(null);
  const intervaloTemporizadorRef = useRef(null);
  const idLlamadaRef = useRef(null);

  const { ejecutar } = useApi();
  const navegar = useNavigate();

  const detenerTemporizador = () => {
    if (intervaloTemporizadorRef.current) {
      clearInterval(intervaloTemporizadorRef.current);
      intervaloTemporizadorRef.current = null;
    }
    setTemporizadorActivo(false);
  };

  const iniciarTemporizador = () => {
    if (intervaloTemporizadorRef.current) return;
    setTemporizadorActivo(true);
    intervaloTemporizadorRef.current = setInterval(() => {
      setTiempoRestante((segundos) => {
        if (segundos <= 1) {
          clearInterval(intervaloTemporizadorRef.current);
          intervaloTemporizadorRef.current = null;
          setTemporizadorActivo(false);
          if (idLlamadaRef.current) {
            setModal({
              visible: true,
              idLlamada: idLlamadaRef.current,
              accion: "salir",
            });
          }
          return 0;
        }
        return segundos - 1;
      });
    }, 1000);
  };

  const unirseASala = (contenedor, usuario, idLlamada) => {
    if (!contenedor || frameRef.current) return;
    setAvisoCamara(false);
    setTiempoRestante(DURACION_LLAMADA_SEGUNDOS);
    idLlamadaRef.current = idLlamada;

    const frame = DailyIframe.createFrame(contenedor, {
      iframeStyle: { width: "100%", height: "100%", border: "none" },
      showLeaveButton: false,
      showFullscreenButton: false,
    });
    frameRef.current = frame;

    frame.on("camera-error", () => setAvisoCamara(true));
    frame.on("participant-joined", iniciarTemporizador);
    frame.on("joined-meeting", (evento) => {
      const otros = Object.values(evento?.participants ?? {}).filter(
        (p) => !p.local,
      );
      if (otros.length > 0) iniciarTemporizador();
    });
    frame.on("participant-left", (evento) => {
      if (evento?.participant?.local) return;
      detenerTemporizador();
      setModal((actual) => {
        if (actual.visible || !idLlamadaRef.current) return actual;
        return {
          visible: true,
          idLlamada: idLlamadaRef.current,
          accion: "siguiente",
        };
      });
    });

    frame
      .join({ url: URL_SALA_DAILY, userName: usuario?.username })
      .catch(() => setAvisoCamara(true));
  };

  const destruirFrame = async () => {
    detenerTemporizador();
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

  const pedirMatch = (idLlamada, accion) => {
    detenerTemporizador();
    setModal({ visible: true, idLlamada, accion });
  };

  const responderMatch = async (quiereMatch) => {
    const { idLlamada, accion } = modal;
    setModal(modalInicial);

    try {
      await ejecutar(
        apiClient.put(`/voto/${idLlamada}`, {
          voto: quiereMatch ? "LIKE" : "NEXT",
        }),
      );
    } catch {
      // fallo silencioso, continuamos con la navegación
    }

    const destino = accion === "siguiente" ? "/sala-espera" : "/inicio";
    await finalizarYNavegar(idLlamada, destino);
  };

  const datosAProveer = {
    avisoCamara,
    colgando,
    modal,
    tiempoRestante,
    temporizadorActivo,
    unirseASala,
    salir,
    pedirMatch,
    responderMatch,
  };

  return (
    <ContextoVideollamada.Provider value={datosAProveer}>
      {children}
    </ContextoVideollamada.Provider>
  );
};

export default ProveedorVideollamada;
export { ContextoVideollamada };
