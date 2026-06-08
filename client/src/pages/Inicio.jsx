import { useNavigate } from "react-router-dom";
import usePerfiles from "../hooks/usePerfiles.js";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

//Sacamos la foto del componente, ya que sino react volveria a crear esta variable en memoria en cada renderizado
const FOTO_HERO =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1920&q=80";

/* Esta es la vista de Inicio, la cual tiene que ser la más atractiva para el usuario */
const Inicio = () => {
  const { perfilPropio, error } = usePerfiles();
  const navegar = useNavigate();

  //Si no es el perfil propio y nos devuelve un error, mostramos un mensaje de error y un botón para que vuelva a logearse
  if (!perfilPropio && error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center max-w-sm w-full">
          <p className="text-red-500 mb-4 font-medium">
            No se pudo cargar el perfil. Inténtalo de nuevo.
          </p>
          <BotonPrimario
            onClick={() => navegar("/login")}
            variante="secundario"
          >
            Volver al inicio
          </BotonPrimario>
        </div>
      </div>
    );
  }

  //Si lo único que pasa esque el perfil no es propio esque está cargando
  if (!perfilPropio) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg font-medium">
          Cargando tu perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* -mt-[60px]: margen negativo que hace que la imagen suba y se meta debajo de la cabecera 
          overflow-hidden: evita que la imagen genere barras de scroll horizontales que no queremos
      */}
      <div className="relative -mt-[60px] min-h-screen flex items-center justify-center overflow-hidden">
        {/* En primer lugar metemos la imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${FOTO_HERO}')` }}
        />
        {/* En segundo lugar aplicamos un gradiente semitransparente para oscurecer la imagen original. Es perfecto para que se lea todo a la perfección */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/65 via-rose-600/45 to-orange-400/35" />

        {/* En tercer lugar metemos el contenido principal con z-10 para que quede por encima del filtro */}
        <div className="relative z-10 flex flex-col items-center text-center gap-7 px-8 pt-[60px]">
          {/* Introducimos un emoji con relieve */}
          <span className="text-7xl drop-shadow-lg">💘</span>

          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              ¡Bienvenido,{" "}
              {/* Accentuamos el nombre del usuario con un color de acento */}
              <span className="text-orange-300">{perfilPropio.nombre}</span>!
            </h1>
            <p className="text-xl text-white/80 max-w-lg leading-relaxed font-medium drop-shadow">
              Tu próxima conexión especial está a solo un clic de distancia.
            </p>
          </div>

          {/* Botón para llamar al usuario a meterse en la sala de espera para hacer videollamadas */}
          <BotonPrimario
            onClick={() => navegar("/sala-espera")}
            className="bg-white text-rose-500 hover:bg-rose-50 shadow-lg"
          >
            💞 Buscar Cita
          </BotonPrimario>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
