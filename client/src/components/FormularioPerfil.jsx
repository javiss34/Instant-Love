import { useState, useEffect } from "react";
import { obtenerMiPerfil, actualizarPerfil } from "../services/profileService.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";

const etiquetaGenero = { H: "Hombre", M: "Mujer", O: "Otro" };
const etiquetaPreferencia = { H: "Hombres", M: "Mujeres", AMBOS: "Ambos" };
const etiquetaRedSocial = { INSTAGRAM: "Instagram", WHATSAPP: "WhatsApp", "TIK TOK": "TikTok", OTRO: "Otro" };

const FormularioPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  const [nombre, setNombre] = useState("");
  const [preferenciaGenero, setPreferenciaGenero] = useState("");
  const [redSocialTipo, setRedSocialTipo] = useState("");
  const [redSocialUsuario, setRedSocialUsuario] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await obtenerMiPerfil();
        setPerfil(datos);
        setNombre(datos.nombre || "");
        setPreferenciaGenero(datos.preferencia_genero || "");
        setRedSocialTipo(datos.red_social_tipo || "");
        setRedSocialUsuario(datos.red_social_usuario || "");
      } catch {
        setError("No se pudo cargar el perfil.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(false);

    try {
      const perfilActualizado = await actualizarPerfil({
        nombre,
        preferencia_genero: preferenciaGenero,
        red_social_tipo: redSocialTipo,
        red_social_usuario: redSocialUsuario,
      });
      setPerfil(perfilActualizado);
      setModoEdicion(false);
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch {
      setError("No se pudo guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setNombre(perfil.nombre || "");
    setPreferenciaGenero(perfil.preferencia_genero || "");
    setRedSocialTipo(perfil.red_social_tipo || "");
    setRedSocialUsuario(perfil.red_social_usuario || "");
    setError(null);
    setModoEdicion(false);
  };

  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-rose-400 text-lg animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  if (error && !perfil) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const inicial = perfil.nombre?.[0].toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">

      {/* Cabecera del perfil */}
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-md shrink-0">
          {inicial}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800">{perfil.nombre}</h1>
          <p className="text-gray-400 mt-1">{perfil.User?.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
            {perfil.User?.rol === "admin" ? "Administrador" : "Usuario"}
          </span>
        </div>
        {!modoEdicion && (
          <BotonPrimario onClick={() => setModoEdicion(true)} variante="secundario" className="shrink-0">
            ✏️ Editar perfil
          </BotonPrimario>
        )}
      </div>

      {/* Feedback */}
      {exito && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          ✅ Perfil actualizado correctamente.
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Información de solo lectura */}
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">
          Información de tu cuenta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-rose-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Género</p>
            <p className="text-gray-800 font-semibold">{etiquetaGenero[perfil.genero] ?? "—"}</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Fecha de nacimiento</p>
            <p className="text-gray-800 font-semibold">
              {perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).toLocaleDateString("es-ES") : "—"}
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
          <form onSubmit={handleGuardar} className="flex flex-col gap-5">
            <InputFormulario
              id="nombre"
              label="Nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <SelectFormulario
              id="preferenciaGenero"
              label="Me interesan"
              value={preferenciaGenero}
              onChange={(e) => setPreferenciaGenero(e.target.value)}
            >
              <option value="">Selecciona una opción</option>
              <option value="H">Hombres</option>
              <option value="M">Mujeres</option>
              <option value="AMBOS">Ambos</option>
            </SelectFormulario>

            <SelectFormulario
              id="redSocialTipo"
              label="Red social"
              value={redSocialTipo}
              onChange={(e) => setRedSocialTipo(e.target.value)}
            >
              <option value="">Sin red social</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TIK TOK">TikTok</option>
              <option value="OTRO">Otro</option>
            </SelectFormulario>

            <InputFormulario
              id="redSocialUsuario"
              label="Usuario / número"
              type="text"
              value={redSocialUsuario}
              onChange={(e) => setRedSocialUsuario(e.target.value)}
              placeholder="@tu_usuario"
            />

            <div className="flex gap-3 pt-2">
              <BotonPrimario type="submit" disabled={guardando} className="flex-1">
                {guardando ? "Guardando..." : "💾 Guardar cambios"}
              </BotonPrimario>
              <BotonPrimario type="button" onClick={handleCancelar} variante="secundario" className="flex-1">
                Cancelar
              </BotonPrimario>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-pink-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Me interesan</p>
              <p className="text-gray-800 font-semibold">{etiquetaPreferencia[perfil.preferencia_genero] ?? "—"}</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Red social</p>
              <p className="text-gray-800 font-semibold">
                {perfil.red_social_tipo ? etiquetaRedSocial[perfil.red_social_tipo] : "—"}
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 sm:col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Usuario / número</p>
              <p className="text-gray-800 font-semibold">{perfil.red_social_usuario || "—"}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default FormularioPerfil;
