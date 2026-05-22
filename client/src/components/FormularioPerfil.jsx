import { useState, useEffect } from "react";
import usePerfiles from "../hooks/usePerfiles.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";

const etiquetaGenero = { H: "Hombre", M: "Mujer", O: "Otro" };
const etiquetaPreferencia = { H: "Hombres", M: "Mujeres", AMBOS: "Ambos" };
const etiquetaRedSocial = {
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  "TIK TOK": "TikTok",
  OTRO: "Otro",
};

const datosPerfilInicial = {
  nombre: "",
  preferencia_genero: "",
  red_social_tipo: "",
  red_social_usuario: "",
};

const FormularioPerfil = () => {
  const { perfilPropio, actualizarPerfilPropio, cargando, error } = usePerfiles();
  const [datos, setDatos] = useState(datosPerfilInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);

  useEffect(() => {
    if (perfilPropio) {
      setDatos({
        nombre: perfilPropio.nombre ?? "",
        preferencia_genero: perfilPropio.preferencia_genero ?? "",
        red_social_tipo: perfilPropio.red_social_tipo ?? "",
        red_social_usuario: perfilPropio.red_social_usuario ?? "",
      });
    }
  }, [perfilPropio]);

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setMensajeError(null);
    setDatos({ ...datos, [name]: value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensajeExito(false);
    try {
      const ok = await actualizarPerfilPropio(datos);
      if (ok) {
        setModoEdicion(false);
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
      }
    } catch (err) {
      setMensajeError(
        err.response?.data?.mensaje ??
          "No se pudo guardar los cambios. Inténtalo de nuevo.",
      );
    }
  };

  const cancelar = () => {
    setDatos({
      nombre: perfilPropio?.nombre ?? "",
      preferencia_genero: perfilPropio?.preferencia_genero ?? "",
      red_social_tipo: perfilPropio?.red_social_tipo ?? "",
      red_social_usuario: perfilPropio?.red_social_usuario ?? "",
    });
    setMensajeError(null);
    setModoEdicion(false);
  };

  if (!perfilPropio && error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-red-500">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  if (!perfilPropio) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-rose-400 text-lg animate-pulse">
          Cargando perfil...
        </p>
      </div>
    );
  }

  const inicial = perfilPropio.nombre?.[0].toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">
      {/* Cabecera del perfil */}
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-md shrink-0">
          {inicial}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {perfilPropio.nombre}
          </h1>
          <p className="text-gray-400 mt-1">{perfilPropio.User?.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
            {perfilPropio.User?.rol === "ADMIN" ? "Administrador" : "Usuario"}
          </span>
        </div>
        {!modoEdicion && (
          <BotonPrimario
            onClick={() => setModoEdicion(true)}
            variante="secundario"
            className="!w-auto shrink-0 px-6"
          >
            ✏️ Editar perfil
          </BotonPrimario>
        )}
      </div>

      {/* Feedback */}
      {mensajeExito && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          ✅ Perfil actualizado correctamente.
        </div>
      )}
      {mensajeError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {mensajeError}
        </div>
      )}

      {/* Información de solo lectura */}
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">
          Información de tu cuenta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-rose-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
              Género
            </p>
            <p className="text-gray-800 font-semibold">
              {etiquetaGenero[perfilPropio.genero] ?? "—"}
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
              Fecha de nacimiento
            </p>
            <p className="text-gray-800 font-semibold">
              {perfilPropio.fecha_nacimiento
                ? new Date(perfilPropio.fecha_nacimiento).toLocaleDateString(
                    "es-ES",
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Sección editable */}
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">
          {modoEdicion ? "Editando perfil" : "Preferencias y contacto"}
        </h2>

        {modoEdicion ? (
          <form onSubmit={enviar} className="flex flex-col gap-5">
            <InputFormulario
              id="nombre"
              name="nombre"
              label="Nombre"
              type="text"
              value={datos.nombre}
              onChange={actualizarDato}
              required
            />

            <SelectFormulario
              id="preferencia_genero"
              name="preferencia_genero"
              label="Me interesan"
              value={datos.preferencia_genero}
              onChange={actualizarDato}
            >
              <option value="">Selecciona una opción</option>
              <option value="H">Hombres</option>
              <option value="M">Mujeres</option>
              <option value="AMBOS">Ambos</option>
            </SelectFormulario>

            <SelectFormulario
              id="red_social_tipo"
              name="red_social_tipo"
              label="Red social"
              value={datos.red_social_tipo}
              onChange={actualizarDato}
            >
              <option value="">Sin red social</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TIK TOK">TikTok</option>
              <option value="OTRO">Otro</option>
            </SelectFormulario>

            <InputFormulario
              id="red_social_usuario"
              name="red_social_usuario"
              label="Usuario / número"
              type="text"
              value={datos.red_social_usuario}
              onChange={actualizarDato}
              placeholder="@tu_usuario"
            />

            <div className="flex gap-3 pt-2">
              <BotonPrimario
                type="submit"
                disabled={cargando}
                className="flex-1"
              >
                {cargando ? "Guardando..." : "💾 Guardar cambios"}
              </BotonPrimario>
              <BotonPrimario
                type="button"
                onClick={cancelar}
                variante="secundario"
                className="flex-1"
              >
                Cancelar
              </BotonPrimario>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-pink-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Me interesan
              </p>
              <p className="text-gray-800 font-semibold">
                {etiquetaPreferencia[perfilPropio.preferencia_genero] ?? "—"}
              </p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Red social
              </p>
              <p className="text-gray-800 font-semibold">
                {perfilPropio.red_social_tipo
                  ? etiquetaRedSocial[perfilPropio.red_social_tipo]
                  : "—"}
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 sm:col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Usuario / número
              </p>
              <p className="text-gray-800 font-semibold">
                {perfilPropio.red_social_usuario || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioPerfil;
