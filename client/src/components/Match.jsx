//Componente que muestra la información de un usuario con el que se ha hecho match
const Match = ({ match }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-rose-100">
    {/* Foto con badge de repetición si han hecho match más de una vez */}
    <div className="relative shrink-0">
      <img
        src={match.foto}
        alt={match.nombre}
        className="w-14 h-14 rounded-full object-cover"
      />
      {match.veces > 1 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {match.veces}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-gray-800 text-lg">{match.nombre}</p>
      {match.red_social_usuario && (
        <p className="text-sm text-gray-500 truncate">
          {match.red_social_tipo === "OTRO"
            ? match.red_social_usuario
            : `${match.red_social_tipo}: ${match.red_social_usuario}`}
        </p>
      )}
    </div>
  </div>
);

export default Match;
