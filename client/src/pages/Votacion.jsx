import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enviarVoto } from "../services/outcomeService.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const iconoRedSocial = { INSTAGRAM: "📸", WHATSAPP: "💬", "TIK TOK": "🎵", OTRO: "🔗" };

const Votacion = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [votando, setVotando] = useState(false);

  const handleVoto = async (voto) => {
    setError(null);
    setVotando(true);
    try {
      const datos = await enviarVoto(id, voto);
      setResultado(datos);
    } catch (err) {
      if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("No se pudo registrar el voto. Inténtalo de nuevo.");
      }
    } finally {
      setVotando(false);
    }
  };

  if (resultado?.match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 text-center">
          <span className="text-7xl animate-bounce">💘</span>
          <div>
            <h1 className="text-3xl font-extrabold text-rose-500">¡Hay Instant Love!</h1>
            <p className="text-gray-500 mt-2 text-sm">Los dos os habéis gustado 🎉</p>
          </div>

          <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-5 flex flex-col gap-2">
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-wide">Datos de contacto</p>
            <p className="text-xl font-bold text-gray-800">{resultado.contacto.nombre}</p>
            {resultado.contacto.red_social_tipo && (
              <p className="text-gray-600 text-sm">
                {iconoRedSocial[resultado.contacto.red_social_tipo] ?? "🔗"}{" "}
                <span className="font-medium">{resultado.contacto.red_social_tipo}:</span>{" "}
                {resultado.contacto.red_social_usuario}
              </p>
            )}
          </div>

          <BotonPrimario onClick={() => navegar("/inicio")}>
            Volver al inicio
          </BotonPrimario>
        </div>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 text-center">
          <span className="text-6xl">🙂</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Voto registrado</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Gracias por participar. ¡Sigue buscando a tu media naranja!
            </p>
          </div>
          <BotonPrimario onClick={() => navegar("/inicio")}>
            Buscar otra cita
          </BotonPrimario>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 text-center">

        <span className="text-5xl">🤔</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">¿Qué te ha parecido la cita?</h1>
          <p className="text-gray-400 text-sm mt-2">Tu voto es completamente privado.</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg py-2 px-3 w-full">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <BotonPrimario onClick={() => handleVoto("LIKE")} disabled={votando} className="py-4 text-base">
            {votando ? "Enviando..." : "¡Me ha gustado! 💖"}
          </BotonPrimario>
          <BotonPrimario onClick={() => handleVoto("NEXT")} disabled={votando} variante="secundario" className="py-4 text-base">
            {votando ? "Enviando..." : "No es para mí 🙅"}
          </BotonPrimario>
        </div>

      </div>
    </div>
  );
};

export default Votacion;
