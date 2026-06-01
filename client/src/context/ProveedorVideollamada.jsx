import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoVideollamada = createContext(null);

const ProveedorVideollamada = ({ children }) => {
  const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;
  const DURACION_LLAMADA_SEGUNDOS = 120;
  const modalInicial = { visible: false, idLlamada: null, accion: null };

  const [avisoCamara, setAvisoCamara] = useState(false);
  const [colgando, setColgando] = useState(false);
  const [modal, setModal] = useState(modalInicial);
  const [tiempoRestante, setTiempoRestante] = useState(
    DURACION_LLAMADA_SEGUNDOS,
  );
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [otroUsuario, setOtroUsuario] = useState(null);

  const frameRef = useRef(null);
  const intervaloTemporizadorRef = useRef(null);
  const idLlamadaRef = useRef(null);
  const tiempoRestanteRef = useRef(DURACION_LLAMADA_SEGUNDOS);

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
          tiempoRestanteRef.current = 0;
          if (idLlamadaRef.current) {
            setModal({
              visible: true,
              idLlamada: idLlamadaRef.current,
              accion: "salir",
            });
          }
          return 0;
        }
        tiempoRestanteRef.current = segundos - 1;
        return segundos - 1;
      });
    }, 1000);
  };

  const unirseASala = async (contenedor, usuario, idLlamada) => {
    if (!contenedor || frameRef.current) return;
    setAvisoCamara(false);
    setOtroUsuario(null);
    setTiempoRestante(DURACION_LLAMADA_SEGUNDOS);
    tiempoRestanteRef.current = DURACION_LLAMADA_SEGUNDOS;
    idLlamadaRef.current = idLlamada;

    try {
      const datos = await ejecutar(apiClient.get(`/llamadas/${idLlamada}`));
      setOtroUsuario(datos);
    } catch {
      // no bloqueamos la llamada si falla
    }

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
      const duracion = DURACION_LLAMADA_SEGUNDOS - tiempoRestanteRef.current;
      await ejecutar(
        apiClient.put(`/llamadas/finalizar/${idLlamada}`, {
          duracion,
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

  const responderMatch = async (quiereMatch, accion) => {
    const { idLlamada } = modal;
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

  const enviarReporte = async (callId, acusadoId, motivo) => {
    await ejecutar(apiClient.post("/reportes", { acusadoId, callId, motivo }));
  };

  const datosAProveer = {
    avisoCamara,
    colgando,
    modal,
    tiempoRestante,
    temporizadorActivo,
    otroUsuario,
    unirseASala,
    salir,
    pedirMatch,
    responderMatch,
    enviarReporte,
  };

  return (
    <ContextoVideollamada.Provider value={datosAProveer}>
      {children}
    </ContextoVideollamada.Provider>
  );
};

export default ProveedorVideollamada;
export { ContextoVideollamada };
