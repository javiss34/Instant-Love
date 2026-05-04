import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { finalizarLlamada } from "../services/callService.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;

const Llamada = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const contenedorRef = useRef(null);
  const frameRef = useRef(null);
  const [colgando, setColgando] = useState(false);

  useEffect(() => {
    const frame = DailyIframe.createFrame(contenedorRef.current, {
      iframeStyle: { width: "100%", height: "100%", border: "none" },
      showLeaveButton: false,
      showFullscreenButton: true,
    });

    frameRef.current = frame;
    frame.join({ url: URL_SALA_DAILY });

    return () => {
      if (frameRef.current) {
        frameRef.current
          .leave()
          .catch(() => {})
          .finally(() => {
            frameRef.current.destroy();
            frameRef.current = null;
          });
      }
    };
  }, []);

  const handleColgar = async () => {
    setColgando(true);
    try {
      if (frameRef.current) {
        await frameRef.current.leave();
      }
      await finalizarLlamada(id, 0, "COMPLETADA");
    } catch {
      // Si falla algo, navegamos igualmente para no dejar al usuario atrapado
    } finally {
      navegar(`/votacion/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between py-8 px-4 gap-6">

      <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <div ref={contenedorRef} className="w-full h-full" />
      </div>

      <div className="flex justify-center">
        <BotonPrimario
          onClick={handleColgar}
          disabled={colgando}
          variante="peligro"
          className="w-auto px-12 py-4 text-lg"
        >
          {colgando ? "Colgando..." : "📵 Colgar"}
        </BotonPrimario>
      </div>

    </div>
  );
};

export default Llamada;
