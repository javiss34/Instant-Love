import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMiPerfil } from "../services/profileService.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const Inicio = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const navegar = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await obtenerMiPerfil();
        setPerfil(datos);
      } catch {
        setError("No se pudo cargar el perfil. Inténtalo de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg font-medium">Cargando tu perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center max-w-sm w-full">
          <p className="text-red-500 mb-4 font-medium">{error}</p>
          <BotonPrimario onClick={() => navegar("/login")} variante="secundario">
            Volver al inicio
          </BotonPrimario>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-orange-50/50 to-amber-50">

      <section className="max-w-7xl mx-auto px-8 pt-20 pb-16 flex flex-col items-center text-center gap-6">

        <span className="text-6xl">💘</span>

        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            ¡Bienvenido,{" "}
            <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
              {perfil.nombre}
            </span>
            !
          </h1>
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed font-medium">
            Tu próxima conexión especial está a solo un clic de distancia.
          </p>
        </div>

        <button
          onClick={() => navegar("/sala-espera")}
          className="bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-colors"
        >
          💞 Buscar Cita
        </button>

      </section>

    </div>
  );
};

export default Inicio;
