import { useState } from "react";
import { esquemaPerfil } from "../biblioteca/validaciones/sesionEsquemas.js";
import BotonPrimario from "./ui/BotonPrimario.jsx";

//Pasamos todos los datos por props, así aquí no hay que llamar a ningún hook.
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
    //Aquí no hace falta usar truy/catch ya que se hara en MiPerfil.jsx
    const resultado = esquemaPerfil.safeParse(datosAEnviar);

    if (!resultado.success) {
      const nuevosErrores = {};
      resultado.error.issues.forEach(({ path, message }) => {
        nuevosErrores[path[0]] = message;
      });
      setErrores(nuevosErrores);
      return;
    }

    alGuardar(resultado.data);
  };

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="nombre" className="text-sm font-semibold text-gray-700">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={datos.nombre}
          onChange={actualizarDato}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-rose-400"
        />
        {errores.nombre && (
          <span className="text-red-500 text-xs mt-1">{errores.nombre}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="preferencia_genero"
          className="text-sm font-semibold text-gray-700"
        >
          Me interesan
        </label>
        <select
          id="preferencia_genero"
          name="preferencia_genero"
          value={datos.preferencia_genero}
          onChange={actualizarDato}
          className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-400"
        >
          <option value="">Selecciona una opción</option>
          <option value="H">Hombres</option>
          <option value="M">Mujeres</option>
          <option value="AMBOS">Ambos</option>
        </select>
        {errores.preferencia_genero && (
          <span className="text-red-500 text-xs mt-1">
            {errores.preferencia_genero}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="red_social_tipo"
          className="text-sm font-semibold text-gray-700"
        >
          Red social
        </label>
        <select
          id="red_social_tipo"
          name="red_social_tipo"
          value={datos.red_social_tipo}
          onChange={actualizarDato}
          className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-400"
        >
          <option value="">Selecciona una opción</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="TIK TOK">TikTok</option>
          <option value="OTRO">Otro</option>
        </select>
        {errores.red_social_tipo && (
          <span className="text-red-500 text-xs mt-1">
            {errores.red_social_tipo}
          </span>
        )}
      </div>

      {datos.red_social_tipo === "OTRO" && (
        <div className="flex flex-col gap-1">
          <label
            htmlFor="red_social_nombre"
            className="text-sm font-semibold text-gray-700"
          >
            ¿Cuál red social?
          </label>
          <input
            id="red_social_nombre"
            name="red_social_nombre"
            type="text"
            value={datos.red_social_nombre}
            onChange={actualizarDato}
            placeholder="ej: Telegram, Snapchat..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-rose-400"
          />
          {errores.red_social_nombre && (
            <span className="text-red-500 text-xs mt-1">
              {errores.red_social_nombre}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="red_social_usuario"
          className="text-sm font-semibold text-gray-700"
        >
          Usuario / número
        </label>
        <input
          id="red_social_usuario"
          name="red_social_usuario"
          type="text"
          value={datos.red_social_usuario}
          onChange={actualizarDato}
          placeholder="@tu_usuario"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-rose-400"
        />
        {errores.red_social_usuario && (
          <span className="text-red-500 text-xs mt-1">
            {errores.red_social_usuario}
          </span>
        )}
      </div>

      {/* Botones de acción del formulario */}
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
            {/* El ml-auto empuja este botón a la derecha en pantallas grandes */}
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
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mt-2">
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
