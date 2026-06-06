import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import usePerfiles from "../../hooks/usePerfiles.js";
import logo from "../../assets/logo-instant-love.png";
import Menu from "./Menu.jsx";
import MenuMovil from "./MenuMovil.jsx";

const Header = () => {
  const { usuario, cerrarSesion } = useSesion();
  const { perfilPropio } = usePerfiles();
  const ubicacion = useLocation();

  const [confirmandoSalir, setConfirmandoSalir] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  //Vemos si la ubicación es inicio para aplicar un estilo diferente
  const esInicio = ubicacion.pathname === "/inicio";

  //Si el perfil aún no cargó o no tiene foto, usamos el logo como fallback
  const foto = perfilPropio?.foto || logo;

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <>
      <header
      /* Es transparente en inicio con desenfoque en el resto de páginas */
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          esInicio
            ? "bg-transparent border-transparent shadow-none"
            : "bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm"
        }`}
      >
        <div className="w-full px-4 md:px-8 py-3 flex justify-between items-center relative">

          {/* Zona de la izquierda, donde están el logo y la marca */}
          <Link
            to={usuario ? "/inicio" : "/login"}
            className="flex items-center gap-2.5"
            onClick={cerrarMenu}
          >
            <img src={logo} alt="InstantLove" className="h-9 w-9 rounded-xl shadow-sm" />
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

          {/* Botón hamburguesa para pantallas pequeñas*/}
          <button
            className={`md:hidden p-2 rounded-lg ${esInicio ? "text-white" : "text-gray-600"}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          {/* Zona del centro, donde está la navegación principal */}
          {usuario ? (
            <Menu usuario={usuario} esInicio={esInicio} />
          ) : (
            <div className="hidden md:block" />
          )}

          {/* Zona de la derecha, foto de perfil y botón de salir de la sesión*/}
          <div className="hidden md:flex items-center gap-3">
            {usuario ? (
              <>
                <button
                  onClick={() => setConfirmandoSalir(true)}
                  className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm ${
                    esInicio
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Salir
                </button>
                <Link to="/mi-perfil">
                  <img
                    src={foto}
                    alt="Foto de perfil"
                    onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                    className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-white"
                  />
                </Link>
              </>
            ) : (
              <nav className="flex items-center gap-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    esInicio ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-rose-500"
                  }`}
                >
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

        {/* Menú para movil a la derecha */}
        {menuAbierto && (
          <MenuMovil
            usuario={usuario}
            foto={foto}
            cerrarMenu={cerrarMenu}
            setConfirmandoSalir={setConfirmandoSalir}
          />
        )}
      </header>

      {/* Si dejaba el mensaje de confirmación en la cabecera, se quedaba atrapado y no dejaba que tapara toda la pantalla, 
      por eso lo hemo sacado fuera, para que pueda ponerse encima de toda la página sin romperse */}
      {confirmandoSalir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" role="dialog" aria-modal="true" aria-labelledby="modal-salir-titulo">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <p id="modal-salir-titulo" className="text-gray-800 font-bold text-lg mb-2">¿Seguro que quieres salir?</p>
            <p className="text-gray-400 text-sm mb-6">Se cerrará tu sesión.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmandoSalir(false); cerrarSesion(); }}
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
