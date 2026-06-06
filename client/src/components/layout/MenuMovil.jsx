import { Link } from "react-router-dom";

const MenuMovil = ({
  usuario,
  foto,
  cerrarMenu,
  setConfirmandoSalir,
}) => {
  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-rose-100 shadow-xl flex flex-col px-6 py-4 gap-4 transition-all">
      {usuario ? (
        <>
          {/* Cabecera con avatar y email */}
          <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-100">
            <img
              src={foto}
              alt="Foto de perfil"
              onError={(e) => { e.target.onerror = null; e.target.src = "/logo-instant-love.png"; }}
              className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-rose-100"
            />
            <div>
              <p className="text-sm font-bold text-gray-800">{usuario.email}</p>
              <p className="text-xs text-rose-500 font-medium">Mi Cuenta</p>
            </div>
          </div>

          {/* Enlaces de navegación */}
          <Link
            to="/inicio"
            onClick={cerrarMenu}
            className="text-gray-600 font-medium hover:text-rose-500"
          >
            Inicio
          </Link>
          <Link
            to="/mi-perfil"
            onClick={cerrarMenu}
            className="text-gray-600 font-medium hover:text-rose-500"
          >
            Mi Perfil
          </Link>
          <Link
            to="/estadisticas"
            onClick={cerrarMenu}
            className="text-gray-600 font-medium hover:text-rose-500"
          >
            Estadísticas
          </Link>
          {usuario?.rol === "ADMIN" && (
            <Link
              to="/admin"
              onClick={cerrarMenu}
              className="text-gray-600 font-medium hover:text-rose-500"
            >
              Admin
            </Link>
          )}

          {/* CTA y salida */}
          <Link
            to="/sala-espera"
            onClick={cerrarMenu}
            className="mt-2 text-center text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-400 py-3 rounded-xl shadow-md"
          >
            Empezar Llamada
          </Link>
          <button
            onClick={() => {
              cerrarMenu();
              setConfirmandoSalir(true);
            }}
            className="mt-2 text-center text-sm font-bold text-white bg-red-500 hover:bg-red-600 py-3 rounded-xl shadow-sm transition-colors"
          >
            Salir
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={cerrarMenu}
            className="text-center text-gray-600 font-medium py-2"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            onClick={cerrarMenu}
            className="text-center text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-400 py-3 rounded-xl shadow-md"
          >
            Registrarse
          </Link>
        </>
      )}
    </div>
  );
};

export default MenuMovil;
