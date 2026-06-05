import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import useVideollamada from "../hooks/useVideollamada.js";

//Función que declaramos fuera del componente por mejor rendimiento.
const formatearTiempo = (segundos) => {
  const minutos = Math.floor(segundos / 60)
    .toString()
    .padStart(2, "0"); //padStart(2, "0") esto hace que el número tenga siempre 2 carácteres
  const resto = (segundos % 60).toString().padStart(2, "0");
  return `${minutos}:${resto}`;
};

/* Esta es la vista de la videollamada */
const Llamada = () => {
  const { id } = useParams();
  const { usuario } = useSesion();

  const {
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
  } = useVideollamada();

  //Crea una referencia directa al nodo real del DOM, sirve para que las librerias puedan enganchar el flujo de la cámara
  const contenedorRef = useRef(null);

  const motivosReporte = [
    "Comportamiento inapropiado",
    "Acoso o intimidación",
    "Contenido sexual no deseado",
    "Lenguaje ofensivo o discriminatorio",
    "Otro",
  ];

  //En vez de usar 4 useState distintos, agrupamos la lógica del modal de reportes en un solo objeto
  const [modalReporte, setModalReporte] = useState({
    visible: false,
    motivo: motivosReporte[0],
    enviando: false,
    enviado: false,
  });

  //Monataje de la sala
  useEffect(() => {
    //Al entrar, si tenemos el contenedor y el usuario está cargado, nos unimos a la sala
    if (contenedorRef.current && usuario) {
      unirseASala(contenedorRef.current, usuario, id);
    }
    //Sino se sale
    return () => {
      salir();
    };
  }, [usuario]); // solo se ejecuta cuando el usuario cambia

  //Calculamos si quedan 10s o menos
  const tiempoCritico = tiempoRestante <= 10;

  return (
    //Diseño a pantalla completo restando la altura del Header
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-900 overflow-hidden">
      {/* Aviso de permisos, como camara/micro */}
      {avisoCamara && (
        <div className="shrink-0 bg-yellow-500 text-yellow-900 text-sm font-medium px-4 py-3 text-center">
          No se ha podido acceder a la cámara o micrófono. Puedes seguir en la
          llamada en modo solo texto.
        </div>
      )}

      {/* Area del video */}
      <div className="flex-1 relative min-h-0">
        {temporizadorActivo && (
          /* Temporizador flotante con efecto crsital */
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur px-5 py-2 rounded-full shadow-xl flex items-center gap-2">
            <span className={`text-xl ${tiempoCritico ? "animate-pulse" : ""}`}>
              ⏱️
            </span>
            <span
              className={`font-mono font-bold text-lg tabular-nums ${
                tiempoCritico ? "text-red-500" : "text-gray-800"
              }`}
            >
              {formatearTiempo(tiempoRestante)}
            </span>
          </div>
        )}
        {/* Aquí la librería externa inyectará los videas gracias a la referencia */}
        <div className="w-full h-full" ref={contenedorRef} />
      </div>

      {/* Barra de controles inferior */}
      <div className="shrink-0 flex items-center justify-between gap-4 p-4 bg-slate-800 border-t border-slate-700">
        <button
          onClick={() =>
            setModalReporte((prev) => ({ ...prev, visible: true }))
          }
          disabled={colgando || !otroUsuario}
          className="text-slate-400 hover:text-rose-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Reportar usuario"
        >
          🚩 Reportar
        </button>
        <div className="flex gap-4">
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
      </div>

      {/* Modal decisión de match tras finalizar el tiempo */}
      {modal.visible && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-match-titulo"
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-4xl mb-4">💕</div>
            <h2
              id="modal-match-titulo"
              className="text-xl font-bold text-gray-800 mb-2"
            >
              ¿Te ha gustado esta persona?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Si los dos decís que sí, ¡tenéis Instant Love!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => responderMatch(true, modal.accion)}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Sí 💕
              </button>
              <button
                onClick={() => responderMatch(false, "siguiente")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Siguiente ⏭️
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para reportar */}
      {modalReporte.visible && (
        //Accesibilidad: Añadimos atributos 'role' y 'aria-*' para lectores de pantalla
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reporte-titulo"
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            {/* Muestra la pantalla de reporte enviado o la de formulario */}
            {modalReporte.enviado ? (
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-800 font-bold text-lg">
                  Reporte enviado
                </p>
                <p className="text-gray-500 text-sm mt-1 mb-6">
                  Nuestro equipo lo revisará pronto.
                </p>
                <button
                  onClick={() =>
                    setModalReporte({
                      visible: false,
                      motivo: motivosReporte[0],
                      enviando: false,
                      enviado: false,
                    })
                  }
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-3">🚩</div>
                <h2
                  id="modal-reporte-titulo"
                  className="text-lg font-bold text-gray-800 mb-1"
                >
                  ¿Seguro que quieres reportar a{" "}
                  {otroUsuario?.nombre ?? otroUsuario?.username}?
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  Selecciona el motivo del reporte.
                </p>
                <select
                  value={modalReporte.motivo}
                  onChange={(e) =>
                    setModalReporte((prev) => ({
                      ...prev,
                      motivo: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  {motivosReporte.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      setModalReporte((prev) => ({ ...prev, enviando: true }));
                      try {
                        await enviarReporte(
                          id,
                          otroUsuario.id,
                          modalReporte.motivo,
                        );
                        setModalReporte((prev) => ({
                          ...prev,
                          enviando: false,
                          enviado: true,
                        }));
                      } catch {
                        setModalReporte((prev) => ({
                          ...prev,
                          enviando: false,
                        }));
                      }
                    }}
                    disabled={modalReporte.enviando}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {modalReporte.enviando ? "Enviando..." : "Sí, reportar"}
                  </button>
                  <button
                    onClick={() =>
                      setModalReporte({
                        visible: false,
                        motivo: motivosReporte[0],
                        enviando: false,
                        enviado: false,
                      })
                    }
                    disabled={modalReporte.enviando}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Llamada;
