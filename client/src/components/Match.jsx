//Componente que muestra la información de un usuario con el que se ha hecho match
const Match = ({ match }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-rose-100">
    <img
      src={match.foto}
      alt={match.nombre}
      className="w-14 h-14 rounded-full object-cover shrink-0"
    />
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
