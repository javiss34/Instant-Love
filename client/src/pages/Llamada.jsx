import useLlamada from "../hooks/useLlamada.js";

const Llamada = () => {
  const { contenedorRef, colgando, avisoCamara, colgar, siguiente } = useLlamada();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-8 px-4 gap-4">

      {avisoCamara && (
        <div className="w-full max-w-4xl bg-yellow-500 text-yellow-900 text-sm font-medium rounded-xl px-4 py-3 text-center">
          No se ha podido acceder a la cámara o micrófono. Puedes seguir en la llamada en modo solo texto.
        </div>
      )}

      <div className="relative w-full max-w-4xl">
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          <div ref={contenedorRef} className="w-full h-full" />
        </div>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-4">
          <button
            onClick={siguiente}
            disabled={colgando}
            className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente ⏭️
          </button>
          <button
            onClick={colgar}
            disabled={colgando}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {colgando ? "Colgando..." : "📵 Colgar"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Llamada;
