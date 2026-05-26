import useEstadisticas from "../hooks/useEstadisticas.js";

const Estadisticas = () => {
  const { estadisticas, cargando } = useEstadisticas();

  const datos = [
    { icono: "💬", etiqueta: "Citas realizadas", valor: estadisticas?.citas ?? 0 },
    { icono: "⏱️", etiqueta: "Minutos de conversación", valor: estadisticas?.minutos ?? 0 },
    { icono: "✨", etiqueta: "Conexiones nuevas", valor: estadisticas?.conexiones ?? 0 },
  ];

  const matches = estadisticas?.matches ?? [];

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
                <div
                  key={stat.etiqueta}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center gap-3 shadow-sm border border-rose-100 hover:shadow-md transition-shadow"
                >
                  <span className="text-5xl">{stat.icono}</span>
                  <p className="text-5xl font-extrabold text-gray-800">{stat.valor}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold text-center">
                    {stat.etiqueta}
                  </p>
                </div>
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
                  {matches.map((match, i) => (
                    <div
                      key={i}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-rose-100"
                    >
                      <img
                        src={match.foto}
                        alt={match.nombre}
                        className="w-14 h-14 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-lg">{match.nombre}</p>
                        {match.red_social_usuario && (
                          <p className="text-sm text-gray-500 truncate">
                            {match.red_social_tipo}: {match.red_social_usuario}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </section>
    </div>
  );
};

export default Estadisticas;
