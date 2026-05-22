import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { finalizarLlamada } from "../services/callService.js";
import useAuth from "./useAuth.js";

const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;

const useLlamada = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const contenedorRef = useRef(null);
  const frameRef = useRef(null);
  const [colgando, setColgando] = useState(false);
  const [avisoCamara, setAvisoCamara] = useState(false);

  useEffect(() => {
    if (!contenedorRef.current) return;

    const frame = DailyIframe.createFrame(contenedorRef.current, {
      iframeStyle: { width: "100%", height: "100%", border: "none" },
      showLeaveButton: false,
      showFullscreenButton: false,
      showPreJoinUI: false,
    });

    frameRef.current = frame;

    frame.on("camera-error", () => setAvisoCamara(true));

    frame.join({ url: URL_SALA_DAILY, userName: usuario?.username }).catch(() => {
      setAvisoCamara(true);
    });

    return () => {
      if (frameRef.current) {
        frameRef.current.off("camera-error");
        frameRef.current
          .leave()
          .catch(() => {})
          .finally(() => {
            frameRef.current?.destroy();
            frameRef.current = null;
          });
      }
    };
  }, []);

  const destruirFrame = async () => {
    if (frameRef.current) {
      await frameRef.current.leave().catch(() => {});
      frameRef.current.destroy();
      frameRef.current = null;
    }
  };

  const colgar = async () => {
    setColgando(true);
    try {
      await destruirFrame();
      await finalizarLlamada(id, 0, "COMPLETADA");
    } catch {
      // navegamos igualmente para no dejar al usuario atrapado
    } finally {
      navegar(`/votacion/${id}`);
    }
  };

  const siguiente = async () => {
    setColgando(true);
    try {
      await destruirFrame();
      await finalizarLlamada(id, 0, "COMPLETADA");
    } catch {
      // navegamos igualmente
    } finally {
      navegar("/sala-espera");
    }
  };

  return { contenedorRef, colgando, avisoCamara, colgar, siguiente };
};

export default useLlamada;
