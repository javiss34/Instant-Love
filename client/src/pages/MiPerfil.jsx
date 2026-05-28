import { useState, useEffect } from "react";
import usePerfiles from "../hooks/usePerfiles.js";
import useSesion from "../hooks/useSesion.js";
import FormularioPerfil from "../components/FormularioPerfil.jsx";
import MostrarError from "../components/ui/MostrarError.jsx";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";

const MiPerfil = () => {
  const etiquetaGenero = { H: "Hombre", M: "Mujer", O: "Otro" };
  const etiquetaPreferencia = { H: "Hombres", M: "Mujeres", AMBOS: "Ambos" };
  const etiquetaRedSocial = { INSTAGRAM: "Instagram", WHATSAPP: "WhatsApp", "TIK TOK": "TikTok", OTRO: "Otro" };

  const { perfilPropio, actualizarPerfilPropio, cargando, error } = usePerfiles();
  const { eliminarCuenta, cargando: cargandoSesion } = useSesion();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosParaFormulario, setDatosParaFormulario] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    if (perfilPropio) {
      const tipo = perfilPropio.red_social_tipo ?? "";
      const usuarioRaw = perfilPropio.red_social_usuario ?? "";
      const partes = tipo === "OTRO" && usuarioRaw.includes(": ") ? usuarioRaw.split(": ") : null;

      setDatosParaFormulario({
        nombre: perfilPropio.nombre ?? "",
        preferencia_genero: perfilPropio.preferencia_genero ?? "",
        red_social_tipo: tipo,
        red_social_nombre: partes ? partes[0] : "",
        red_social_usuario: partes ? partes.slice(1).join(": ") : usuarioRaw,
      });
    }
  }, [perfilPropio, modoEdicion]);

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

  const inicial = perfilPropio.nombre?.[0].toUpperCase();

  const procesarGuardar = async (datosValidados) => {
    setErrorGeneral("");
    try {
      const ok = await actualizarPerfilPropio(datosValidados);
      if (ok) {
        setModoEdicion(false);
        setConfirmandoEliminar(false);
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
      }
    } catch (err) {
      setErrorGeneral(err.response?.data?.mensaje ?? "No se pudieron guardar los cambios.");
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 w-full min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 w-full">
        
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-md shrink-0">
            {inicial}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-gray-800">{perfilPropio.nombre}</h1>
            <p className="text-gray-400 mt-1">{perfilPropio.User?.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
              {perfilPropio.User?.rol === "ADMIN" ? "Administrador" : "Usuario"}
            </span>
          </div>
        </div>

        {mensajeExito && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 font-semibold">
            ✅ Perfil actualizado correctamente.
          </div>
        )}
        {errorGeneral && <MostrarError objetoErrores={{ general: errorGeneral }} />}

        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-rose-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Género</p>
                  <p className="text-gray-800 font-bold">{etiquetaGenero[perfilPropio.genero] ?? "—"}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Fecha de nacimiento</p>
                  <p className="text-gray-800 font-bold">
                    {perfilPropio.fecha_nacimiento ? new Date(perfilPropio.fecha_nacimiento).toLocaleDateString("es-ES") : "—"}
                  </p>
                </div>
                <div className="bg-pink-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Me interesan</p>
                  <p className="text-gray-800 font-bold">{etiquetaPreferencia[perfilPropio.preferencia_genero] ?? "—"}</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Red social tipo</p>
                  <p className="text-gray-800 font-bold">
                    {perfilPropio.red_social_tipo ? etiquetaRedSocial[perfilPropio.red_social_tipo] : "—"}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 sm:col-span-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Usuario de contacto</p>
                  <p className="text-gray-800 font-bold">{perfilPropio.red_social_usuario || "—"}</p>
                </div>
              </div>

              {/* Botones de acción de la vista de lectura */}
              <div className="pt-6 mt-2 border-t border-gray-100">
                {!confirmandoEliminar ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    <BotonPrimario variante="secundario" onClick={() => setModoEdicion(true)} className="flex-1 sm:flex-none px-6">
                      ✏️ Editar perfil
                    </BotonPrimario>
                    <BotonPrimario variante="peligro" onClick={() => setConfirmandoEliminar(true)} className="flex-1 sm:flex-none px-6">
                      Eliminar cuenta
                    </BotonPrimario>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                    <p className="text-gray-800 font-bold mb-1">¿Seguro que quieres eliminar tu cuenta?</p>
                    <p className="text-gray-500 text-sm mb-5">Esta acción borrará todos tus datos de forma permanente.</p>
                    <div className="flex flex-wrap gap-3">
                      <BotonPrimario variante="peligro" onClick={eliminarCuenta} disabled={cargandoSesion} className="flex-1 sm:flex-none px-6">
                        {cargandoSesion ? "Eliminando..." : "Sí, eliminar"}
                      </BotonPrimario>
                      <BotonPrimario variante="secundario" onClick={() => setConfirmandoEliminar(false)} className="flex-1 sm:flex-none px-6">
                        Cancelar
                      </BotonPrimario>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MiPerfil;