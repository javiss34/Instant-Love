const Estadistica = ({ icono, etiqueta, valor }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center gap-3 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
    <span className="text-5xl">{icono}</span>
    <p className="text-5xl font-extrabold text-gray-800">{valor}</p>
    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold text-center">
      {etiqueta}
    </p>
  </div>
);

export default Estadistica;
