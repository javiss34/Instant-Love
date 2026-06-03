import { Link } from "react-router-dom";
import useEstadisticas from "../hooks/useEstadisticas.js";
import Estadistica from "../components/Estadistica.jsx";
import Match from "../components/Match.jsx";
import Reporte from "../components/Reporte.jsx";

const Estadisticas = () => {
  const { estadisticas, cargando } = useEstadisticas();

  const datos = [
    { icono: "💬", etiqueta: "Citas realizadas", valor: estadisticas?.citas ?? 0 },
    { icono: "⏱️", etiqueta: "Minutos de conversación", valor: estadisticas?.minutos ?? 0 },
    { icono: "✨", etiqueta: "Conexiones nuevas", valor: estadisticas?.conexiones ?? 0 },
  ];

  const matches = estadisticas?.matches ?? [];
  const reportes = estadisticas?.reportes ?? null;

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="text-center mb-12">
          <span className="text-5xl">📊</span>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-4">Tus Estadísticas</h1>
          <p className="text-gray-500 mt-3 text-lg">Un resumen de tu actividad en InstantLove.</p>
        </div>

        {cargando ? (
          <p className="text-center text-gray-400 text-lg">Cargando...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {datos.map((stat) => (
                <Estadistica key={stat.etiqueta} {...stat} />
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                💕 Tus Matches
              </h2>
              {matches.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aún no tienes ningún match. ¡Sigue intentándolo!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {matches.filter((match) => match?.nombre && match?.foto).map((match, i) => (
                    <Match key={i} match={match} />
                  ))}
                </div>
              )}
            </div>

            {reportes !== null && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Últimos reportes</h2>
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Ver panel admin →
                  </Link>
                </div>
                {reportes.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No hay reportes recientes.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {reportes.map((r) => (
                      <Reporte key={r.id} reporte={r} mostrarDestino />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </section>
    </div>
  );
};

export default Estadisticas;
