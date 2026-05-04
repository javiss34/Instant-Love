const datos = [
  { icono: "💬", etiqueta: "Citas realizadas", valor: "0" },
  { icono: "⏱️", etiqueta: "Minutos de conversación", valor: "0" },
  { icono: "✨", etiqueta: "Conexiones nuevas", valor: "0" },
];

const Estadisticas = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="text-center mb-12">
          <span className="text-5xl">📊</span>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-4">Tus Estadísticas</h1>
          <p className="text-gray-500 mt-3 text-lg">Un resumen de tu actividad en InstantLove.</p>
        </div>

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

      </section>
    </div>
  );
};

export default Estadisticas;
