import { useNavigate } from "react-router-dom";
import useBusqueda from "../hooks/useBusqueda.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const SalaEspera = () => {
  const navegar = useNavigate();
  const { error } = useBusqueda();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col gap-4">
          <p className="text-red-500">{error}</p>
          <BotonPrimario onClick={() => navegar("/inicio")} variante="secundario">
            Volver al inicio
          </BotonPrimario>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-8 text-center">

        <div className="flex flex-col items-center gap-3">
          <span className="text-6xl animate-bounce">💘</span>
          <h1 className="text-2xl font-bold text-gray-800">Buscando tu media naranja...</h1>
          <p className="text-gray-500 text-sm">
            Estamos analizando compatibilidades. Puede tardar unos segundos.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>

        <BotonPrimario onClick={() => navegar("/inicio")} variante="secundario" className="w-auto px-8">
          Cancelar búsqueda
        </BotonPrimario>

      </div>
    </div>
  );
};

export default SalaEspera;
