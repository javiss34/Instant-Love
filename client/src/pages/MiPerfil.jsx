import { useState, useEffect } from "react";
import usePerfiles from "../hooks/usePerfiles.js";
import useSesion from "../hooks/useSesion.js";
import FormularioPerfil from "../components/FormularioPerfil.jsx";
import FotoEditable from "../components/perfil/FotoEditable.jsx";
import VistaLecturaPerfil from "../components/perfil/VistaLecturaPerfil.jsx";
import ZonaPeligro from "../components/perfil/ZonaPeligro.jsx";

/* Componente que delega la interfaz a sus hijos y se centra en juntarlos */
const MiPerfil = () => {
  const { perfilPropio, actualizarPerfilPropio, subirFotoPerfil, cargando, error } =
    usePerfiles();
  const { eliminarCuenta, cargando: cargandoSesion } = useSesion();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosParaFormulario, setDatosParaFormulario] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  // confirmandoEliminar vive aquí porque FormularioPerfil también lo necesita
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  // Prepara los datos del perfil en el formato que espera FormularioPerfil
  useEffect(() => {
    if (perfilPropio) {
      const tipo = perfilPropio.red_social_tipo ?? "";
      const usuarioRaw = perfilPropio.red_social_usuario ?? "";
      const partes =
        tipo === "OTRO" && usuarioRaw.includes(": ")
          ? usuarioRaw.split(": ")
          : null;

      setDatosParaFormulario({
        nombre: perfilPropio.nombre ?? "",
        preferencia_genero: perfilPropio.preferencia_genero ?? "",
        red_social_tipo: tipo,
        red_social_nombre: partes ? partes[0] : "",
        red_social_usuario: partes ? partes.slice(1).join(": ") : usuarioRaw,
      });
    }
  }, [perfilPropio, modoEdicion]);

  // Estados de carga y error tempranos
  if (!perfilPropio && error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-red-500 font-semibold">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  if (!perfilPropio) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse font-bold">Cargando perfil...</p>
      </div>
    );
  }

  //maneja el evento guardar
  const procesarGuardar = async (datosValidados) => {
    const ok = await actualizarPerfilPropio(datosValidados);
    if (ok) {
      setModoEdicion(false);
      setConfirmandoEliminar(false);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 w-full min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12 w-full">

        {/* Tarjeta superior, que contiene el avatar editable, nombre, email, rol */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <FotoEditable
            foto={perfilPropio.foto}
            nombre={perfilPropio.nombre}
            subirFotoPerfil={subirFotoPerfil}
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              {perfilPropio.nombre}
            </h1>
            <p className="text-gray-400 mt-1">{perfilPropio.User?.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
              {perfilPropio.User?.rol === "ADMIN" ? "Administrador" : "Usuario"}
            </span>
          </div>
        </div>

        {/* Notificación de éxito tras guardar */}
        {mensajeExito && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 font-semibold">
            ✅ Perfil actualizado correctamente.
          </div>
        )}

        {/* Tarjeta principal que serán datos o formulario de edición */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5 text-center sm:text-left">
            {modoEdicion ? "Editando tus datos públicos" : "Preferencias y contacto"}
          </h2>

          {modoEdicion ? (
            <FormularioPerfil
              datosIniciales={datosParaFormulario}
              alGuardar={procesarGuardar}
              alCancelar={() => {
                setModoEdicion(false);
                setConfirmandoEliminar(false);
              }}
              cargando={cargando}
              confirmandoEliminar={confirmandoEliminar}
              iniciarEliminacion={() => setConfirmandoEliminar(true)}
              cancelarEliminacion={() => setConfirmandoEliminar(false)}
              ejecutarEliminacion={eliminarCuenta}
              cargandoSesion={cargandoSesion}
            />
          ) : (
            <div className="flex flex-col gap-6">
              <VistaLecturaPerfil perfil={perfilPropio} />
              <ZonaPeligro
                confirmandoEliminar={confirmandoEliminar}
                onIniciarEdicion={() => setModoEdicion(true)}
                onIniciarEliminacion={() => setConfirmandoEliminar(true)}
                onCancelarEliminacion={() => setConfirmandoEliminar(false)}
                eliminarCuenta={eliminarCuenta}
                cargandoSesion={cargandoSesion}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MiPerfil;
