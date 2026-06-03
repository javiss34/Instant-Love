import { useState } from "react";
import { esquemaPerfil } from "../biblioteca/validaciones/sesionEsquemas.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import MostrarError from "./MostrarError.jsx";

const FormularioPerfil = ({
  datosIniciales,
  alGuardar,
  alCancelar,
  cargando,
  confirmandoEliminar,
  iniciarEliminacion,
  cancelarEliminacion,
  ejecutarEliminacion,
  cargandoSesion,
}) => {
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setErrores((prev) => ({ ...prev, [name]: "" }));
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrores({});

    const datosAEnviar = { ...datos };
    if (datos.red_social_tipo === "OTRO") {
      datosAEnviar.red_social_usuario = `${datos.red_social_nombre}: ${datos.red_social_usuario}`;
    }

    const resultado = esquemaPerfil.safeParse(datosAEnviar);
    if (!resultado.success) {
      const nuevosErrores = {};
      resultado.error.issues.forEach(({ path, message }) => {
        nuevosErrores[path[0]] = message;
      });
      setErrores(nuevosErrores);
      return;
    }

    try {
      await alGuardar(resultado.data);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ?? "No se pudieron guardar los cambios.";
      if (mensaje.toLowerCase().includes("nombre")) {
        setErrores({ nombre: mensaje });
      } else if (mensaje.toLowerCase().includes("usuario")) {
        setErrores({ red_social_usuario: mensaje });
      } else {
        setErrores({ general: mensaje });
      }
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-4 sm:gap-5">
      <InputFormulario
        id="nombre"
        name="nombre"
        label="Nombre"
        type="text"
        value={datos.nombre}
        onChange={actualizarDato}
        error={errores.nombre}
      />

      <SelectFormulario
        id="preferencia_genero"
        name="preferencia_genero"
        label="Me interesan"
        value={datos.preferencia_genero}
        onChange={actualizarDato}
        error={errores.preferencia_genero}
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
        error={errores.red_social_tipo}
      >
        <option value="">Selecciona una opción</option>
        <option value="INSTAGRAM">Instagram</option>
        <option value="WHATSAPP">WhatsApp</option>
        <option value="TIK TOK">TikTok</option>
        <option value="OTRO">Otro</option>
      </SelectFormulario>

      {datos.red_social_tipo === "OTRO" && (
        <InputFormulario
          id="red_social_nombre"
          name="red_social_nombre"
          label="¿Cuál red social?"
          type="text"
          value={datos.red_social_nombre}
          onChange={actualizarDato}
          placeholder="ej: Telegram, Snapchat..."
          error={errores.red_social_nombre}
        />
      )}

      <InputFormulario
        id="red_social_usuario"
        name="red_social_usuario"
        label="Usuario / número"
        type="text"
        value={datos.red_social_usuario}
        onChange={actualizarDato}
        placeholder="@tu_usuario"
        error={errores.red_social_usuario}
      />

      <MostrarError objetoErrores={{ general: errores.general }} />

      <div className="pt-4 mt-2 border-t border-gray-100">
        {!confirmandoEliminar ? (
          <div className="flex flex-wrap gap-3 items-center">
            <BotonPrimario
              type="submit"
              disabled={cargando}
              className="flex-1 sm:flex-none px-6"
            >
              {cargando ? "Guardando..." : "💾 Guardar cambios"}
            </BotonPrimario>
            <BotonPrimario
              type="button"
              onClick={alCancelar}
              variante="secundario"
              className="flex-1 sm:flex-none px-6"
            >
              Cancelar
            </BotonPrimario>
            <BotonPrimario
              type="button"
              onClick={iniciarEliminacion}
              variante="peligro"
              className="w-full sm:w-auto sm:ml-auto px-6"
            >
              Eliminar cuenta
            </BotonPrimario>
          </div>
        ) : (
          <div className="bg-red-50 rounded-2xl p-5 sm:p-6 border border-red-200 mt-2">
            <p className="text-gray-800 font-bold mb-1">
              ¿Seguro que quieres eliminar tu cuenta?
            </p>
            <p className="text-gray-500 text-sm mb-5">
              Esta acción borrará todos tus datos de forma permanente.
            </p>
            <div className="flex flex-wrap gap-3">
              <BotonPrimario
                type="button"
                variante="peligro"
                onClick={ejecutarEliminacion}
                disabled={cargandoSesion}
                className="flex-1 sm:flex-none px-6"
              >
                {cargandoSesion ? "Eliminando..." : "Sí, eliminar"}
              </BotonPrimario>
              <BotonPrimario
                type="button"
                variante="secundario"
                onClick={cancelarEliminacion}
                className="flex-1 sm:flex-none px-6"
              >
                Cancelar
              </BotonPrimario>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default FormularioPerfil;
