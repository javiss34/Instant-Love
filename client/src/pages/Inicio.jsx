import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMiPerfil } from "../services/profileService.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const FOTO_HERO = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1920&q=80";

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
    <div className="flex-1">

      {/* Hero — ocupa todo el viewport, sube detrás del header transparente */}
      <div className="relative -mt-[60px] min-h-screen flex items-center justify-center overflow-hidden">

        {/* Foto de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${FOTO_HERO}')` }}
        />

        {/* Overlay con los colores de la marca */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/65 via-rose-600/45 to-orange-400/35" />

        {/* Contenido centrado */}
        <div className="relative z-10 flex flex-col items-center text-center gap-7 px-8 pt-[60px]">

          <span className="text-7xl drop-shadow-lg">💘</span>

          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              ¡Bienvenido,{" "}
              <span className="text-orange-300">
                {perfil.nombre}
              </span>
              !
            </h1>
            <p className="text-xl text-white/80 max-w-lg leading-relaxed font-medium drop-shadow">
              Tu próxima conexión especial está a solo un clic de distancia.
            </p>
          </div>

          <button
            onClick={() => navegar("/sala-espera")}
            className="bg-white text-rose-500 hover:bg-rose-50 font-semibold px-6 py-2.5 rounded-xl shadow-lg transition-colors text-sm"
          >
            💞 Buscar Cita
          </button>

        </div>

      </div>

    </div>
  );
};

export default Inicio;
