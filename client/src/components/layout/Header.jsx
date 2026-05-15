import { Link, useNavigate, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import logo from "../../assets/logo-instant-love.png";

const Header = () => {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const esInicio = ubicacion.pathname === "/inicio";

  const handleCerrarSesion = () => {
    cerrarSesion();
    navegar("/login");
  };

  const inicial = usuario?.email?.[0].toUpperCase();

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      esInicio
        ? "bg-transparent border-transparent shadow-none"
        : "bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm"
    }`}>
      <div className="w-full px-8 py-3 grid grid-cols-3 items-center">

        <Link to={usuario ? "/inicio" : "/login"} className="flex items-center gap-2.5 justify-self-start">
          <img src={logo} alt="InstantLove" className="h-9 w-9 rounded-xl shadow-sm" />
          <span className={`text-xl font-extrabold tracking-tight ${
            esInicio
              ? "text-white drop-shadow"
              : "bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent"
          }`}>
            InstantLove
          </span>
        </Link>

        {usuario ? (
          <nav className="flex items-center justify-center gap-5">
            <Link to="/inicio" className={`text-sm font-medium transition-colors ${
              esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
            }`}>
              Inicio
            </Link>
            <Link
              to="/sala-espera"
              className={`text-sm font-semibold px-5 py-1.5 rounded-full shadow-md transition-colors ${
                esInicio
                  ? "bg-white text-rose-500 hover:bg-rose-50"
                  : "text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
              }`}
            >
              Empezar Llamada
            </Link>
            <Link to="/estadisticas" className={`text-sm font-medium transition-colors ${
              esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
            }`}>
              Estadísticas
            </Link>
            <Link to="/mi-perfil" className={`text-sm font-medium transition-colors ${
              esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
            }`}>
              Mi Perfil
            </Link>
          </nav>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3 justify-self-end">
          {usuario ? (
            <>
              <button
                onClick={handleCerrarSesion}
                className={`text-sm font-medium transition-colors ${
                  esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
                }`}
              >
                Salir
              </button>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-2 ${
                esInicio
                  ? "bg-white text-rose-500 ring-white/30"
                  : "bg-gradient-to-br from-rose-400 to-orange-400 text-white ring-white"
              }`}>
                {inicial}
              </div>
            </>
          ) : (
            <nav className="flex items-center gap-4">
              <Link to="/login" className={`text-sm font-medium transition-colors ${
                esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
              }`}>
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className={`text-sm font-semibold px-4 py-1.5 rounded-full shadow-md transition-colors ${
                  esInicio
                    ? "bg-white text-rose-500 hover:bg-rose-50"
                    : "text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
                }`}
              >
                Registrarse
              </Link>
            </nav>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
