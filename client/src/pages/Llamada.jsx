import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import useVideollamada from "../hooks/useVideollamada.js";

const Llamada = () => {
  const { id } = useParams();
  const { usuario } = useSesion();
  const { avisoCamara, colgando, modal, unirseASala, salir, pedirMatch, responderMatch } =
    useVideollamada();
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (contenedorRef.current && usuario) {
      unirseASala(contenedorRef.current, usuario);
    }
    return () => {
      salir();
    };
  }, [usuario]);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {avisoCamara && (
        <div className="shrink-0 bg-yellow-500 text-yellow-900 text-sm font-medium px-4 py-3 text-center">
          No se ha podido acceder a la cámara o micrófono. Puedes seguir en la
          llamada en modo solo texto.
        </div>
      )}

      <div className="flex-1 min-h-0 w-full" ref={contenedorRef} />

      <div className="shrink-0 flex items-center justify-center gap-4 py-4 px-6 bg-slate-800 border-t border-slate-700">
        <button
          onClick={() => pedirMatch(id, "salir")}
          disabled={colgando}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {colgando ? "Saliendo..." : "Salir"}
        </button>
        <button
          onClick={() => pedirMatch(id, "siguiente")}
          disabled={colgando}
          className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente ⏭️
        </button>
      </div>

      {modal.visible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-4xl mb-4">💕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              ¿Quieres hacer match con esta persona?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Si los dos decís que sí, ¡tenéis Instant Love!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => responderMatch(true)}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Sí 💕
              </button>
              <button
                onClick={() => responderMatch(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Llamada;
