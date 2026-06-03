import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import usePerfiles from "../../hooks/usePerfiles.js";
import logo from "../../assets/logo-instant-love.png";

const Header = () => {
  const { usuario, cerrarSesion } = useSesion();
  const { perfilPropio } = usePerfiles();
  const ubicacion = useLocation();
  const [confirmandoSalir, setConfirmandoSalir] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const esInicio = ubicacion.pathname === "/inicio";

  const inicial = usuario?.email?.[0].toUpperCase();
  const foto = perfilPropio?.foto ?? null;

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          esInicio
            ? "bg-transparent border-transparent shadow-none"
            : "bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm"
        }`}
      >
        <div className="w-full px-4 md:px-8 py-3 flex justify-between items-center relative">
          <Link
            to={usuario ? "/inicio" : "/login"}
            className="flex items-center gap-2.5"
            onClick={cerrarMenu}
          >
            <img
              src={logo}
              alt="InstantLove"
              className="h-9 w-9 rounded-xl shadow-sm"
            />
            <span
              className={`text-xl font-extrabold tracking-tight ${
                esInicio
                  ? "text-white drop-shadow"
                  : "bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent"
              }`}
            >
              InstantLove
            </span>
          </Link>

          <button
            className={`md:hidden p-2 rounded-lg ${
              esInicio ? "text-white" : "text-gray-600"
            }`}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>

          {usuario ? (
            <nav className="hidden md:flex items-center justify-center gap-5">
              <Link
                to="/inicio"
                className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
              >
                Inicio
              </Link>
              <Link
                to="/sala-espera"
                className={`text-sm font-semibold px-5 py-1.5 rounded-full shadow-md transition-colors ${esInicio ? "bg-white text-rose-500 hover:bg-rose-50" : "text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"}`}
              >
                Empezar Llamada
              </Link>
              <Link
                to="/estadisticas"
                className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
              >
                Estadísticas
              </Link>
              {usuario?.rol === "ADMIN" && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/mi-perfil"
                className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
              >
                Mi Perfil
              </Link>
            </nav>
          ) : (
            <div className="hidden md:block" />
          )}

          {/* ACCIONES DERECHA (Visible solo en PC: hidden md:flex) */}
          <div className="hidden md:flex items-center gap-3">
            {usuario ? (
              <>
                <button
                  onClick={() => setConfirmandoSalir(true)}
                  className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
                >
                  Salir
                </button>
                <Link to="/mi-perfil">
                  {foto ? (
                    <img
                      src={foto}
                      alt={inicial}
                      className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-white"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-2 ${esInicio ? "bg-white text-rose-500 ring-white/30" : "bg-gradient-to-br from-rose-400 to-orange-400 text-white ring-white"}`}
                    >
                      {inicial}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <nav className="flex items-center gap-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"}`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className={`text-sm font-semibold px-4 py-1.5 rounded-full shadow-md transition-colors ${esInicio ? "bg-white text-rose-500 hover:bg-rose-50" : "text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"}`}
                >
                  Registrarse
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* Menú desplegable para móvil */}
        {menuAbierto && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-rose-100 shadow-xl flex flex-col px-6 py-4 gap-4 transition-all">
            {usuario ? (
              <>
                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-100">
                  {foto ? (
                    <img
                      src={foto}
                      alt={inicial}
                      className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-rose-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ring-2 bg-gradient-to-br from-rose-400 to-orange-400 text-white ring-rose-100">
                      {inicial}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {usuario.email}
                    </p>
                    <p className="text-xs text-rose-500 font-medium">Mi Cuenta</p>
                  </div>
                </div>

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
                  className="mt-2 text-left text-gray-500 font-medium hover:text-red-500"
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
        )}
      </header>

      {/* MODAL DE CONFIRMACIÓN DE SALIDA (Fuera del header para que pise todo) */}
      {confirmandoSalir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <p className="text-gray-800 font-bold text-lg mb-2">
              ¿Seguro que quieres salir?
            </p>
            <p className="text-gray-400 text-sm mb-6">Se cerrará tu sesión.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmandoSalir(false);
                  cerrarSesion();
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Sí, salir
              </button>
              <button
                onClick={() => setConfirmandoSalir(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;