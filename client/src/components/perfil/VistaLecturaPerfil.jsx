//Declarados fuera del componente por cuestión de rendimiento
const etiquetaGenero = { H: "Hombre", M: "Mujer", O: "Otro" };
const etiquetaPreferencia = { H: "Hombres", M: "Mujeres", AMBOS: "Ambos" };
const etiquetaRedSocial = {
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  "TIK TOK": "TikTok",
  OTRO: "Otro",
};

//Este componente sirve solo para ver los datos del perfil
const VistaLecturaPerfil = ({ perfil }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
      <div className="bg-rose-50 rounded-2xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Género
        </p>
        <p className="text-gray-800 font-bold">
          {etiquetaGenero[perfil.genero] ?? "—"}
        </p>
      </div>

      <div className="bg-orange-50 rounded-2xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Fecha de nacimiento
        </p>
        <p className="text-gray-800 font-bold">
          {perfil.fecha_nacimiento
            ? new Date(perfil.fecha_nacimiento).toLocaleDateString("es-ES")
            : "—"}
        </p>
      </div>

      <div className="bg-pink-50 rounded-2xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Me interesan
        </p>
        <p className="text-gray-800 font-bold">
          {etiquetaPreferencia[perfil.preferencia_genero] ?? "—"}
        </p>
      </div>

      <div className="bg-purple-50 rounded-2xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Red social tipo
        </p>
        <p className="text-gray-800 font-bold">
          {perfil.red_social_tipo
            ? etiquetaRedSocial[perfil.red_social_tipo]
            : "—"}
        </p>
      </div>

      {/* Como el nombre de usaurio puede ser largo hacemos que esta tarjeta ocupe las 2 columnas enteras de ancho */}
      <div className="bg-amber-50 rounded-2xl p-4 sm:col-span-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Usuario de contacto
        </p>
        <p className="text-gray-800 font-bold">
          {perfil.red_social_usuario || "—"}
        </p>
      </div>
    </div>
  );
};

export default VistaLecturaPerfil;
