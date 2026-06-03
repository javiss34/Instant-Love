import { Link } from "react-router-dom";

const Menu = ({ usuario, esInicio }) => {
  const enlace = `text-sm font-medium transition-colors ${
    esInicio
      ? "text-white/90 hover:text-white"
      : "text-gray-500 hover:text-rose-500"
  }`;

  return (
    <nav className="hidden md:flex items-center justify-center gap-5">
      <Link to="/inicio" className={enlace}>
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
      <Link to="/estadisticas" className={enlace}>
        Estadísticas
      </Link>
      {usuario?.rol === "ADMIN" && (
        <Link to="/admin" className={enlace}>
          Admin
        </Link>
      )}
      <Link to="/mi-perfil" className={enlace}>
        Mi Perfil
      </Link>
    </nav>
  );
};

export default Menu;
