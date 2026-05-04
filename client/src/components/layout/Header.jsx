import { Link, useNavigate } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import logo from "../../assets/logo-instant-love.png";

const Header = () => {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navegar("/login");
  };

  const inicial = usuario?.email?.[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="w-full px-8 py-3 grid grid-cols-3 items-center">

        <Link to={usuario ? "/inicio" : "/login"} className="flex items-center gap-2.5 justify-self-start">
          <img src={logo} alt="InstantLove" className="h-9 w-9 rounded-xl shadow-sm" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent tracking-tight">
            InstantLove
          </span>
        </Link>

        {usuario ? (
          <nav className="flex items-center justify-center gap-5">
            <Link to="/inicio" className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors">
              Inicio
            </Link>
            <Link
              to="/sala-espera"
              className="text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 px-5 py-1.5 rounded-full shadow-md transition-colors"
            >
              Empezar Llamada
            </Link>
            <Link to="/estadisticas" className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors">
              Estadísticas
            </Link>
            <Link to="/mi-perfil" className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors">
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
                className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors"
              >
                Salir
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">
                {inicial}
              </div>
            </>
          ) : (
            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors">
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 px-4 py-1.5 rounded-full shadow-md transition-colors"
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
