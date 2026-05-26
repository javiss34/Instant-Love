import { useState } from "react";
import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";

const datosRegistroInicial = {
  username: "",
  nombre: "",
  email: "",
  password: "",
  fecha_nacimiento: "",
  genero: "",
  preferencia_genero: "",
  red_social_tipo: "",
  red_social_nombre: "",
  red_social_usuario: "",
};

const FormularioRegistro = () => {
  const [datos, setDatos] = useState(datosRegistroInicial);
  const [paso, setPaso] = useState(1);
  const [mensajeError, setMensajeError] = useState(null);
  const { registrar, cargando } = useSesion();

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setMensajeError(null);
    setDatos({ ...datos, [name]: value });
  };

  const avanzar = (e) => {
    e.preventDefault();
    setMensajeError(null);
    setPaso(2);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    try {
      const datosAEnviar = { ...datos };
      if (datos.red_social_tipo === "OTRO") {
        datosAEnviar.red_social_usuario = `${datos.red_social_nombre}: ${datos.red_social_usuario}`;
      }
      await registrar(datosAEnviar);
      setDatos(datosRegistroInicial);
    } catch (err) {
      if (err.name === "ZodError") {
        setMensajeError(err.issues?.[0]?.message ?? "Datos del formulario no válidos.");
      } else if (err.response?.data?.mensaje) {
        setMensajeError(err.response.data.mensaje);
      } else {
        setMensajeError("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <img
          src={logo}
          alt="InstantLove"
          className="h-16 w-16 rounded-2xl shadow-md mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-rose-500">InstantLove</h1>
        <p className="text-gray-500 mt-2 text-sm">
          {paso === 1 ? "Crea tu cuenta y empieza a conocer gente" : "Cuéntanos un poco más sobre ti"}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className={`h-1.5 w-8 rounded-full ${paso === 1 ? "bg-rose-500" : "bg-rose-200"}`} />
          <div className={`h-1.5 w-8 rounded-full ${paso === 2 ? "bg-rose-500" : "bg-rose-200"}`} />
        </div>
      </div>

      {paso === 1 ? (
        <form onSubmit={avanzar} className="flex flex-col gap-5">
          <InputFormulario
            id="username"
            name="username"
            label="Nombre de usuario"
            type="text"
            value={datos.username}
            onChange={actualizarDato}
            placeholder="ej: juan_lopez"
            required
          />

          <InputFormulario
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            value={datos.nombre}
            onChange={actualizarDato}
            placeholder="Tu nombre"
            required
          />

          <InputFormulario
            id="email"
            name="email"
            label="Email"
            type="email"
            value={datos.email}
            onChange={actualizarDato}
            placeholder="tu@email.com"
            required
          />

          <InputFormulario
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            value={datos.password}
            onChange={actualizarDato}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <InputFormulario
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            label="Fecha de nacimiento"
            type="date"
            value={datos.fecha_nacimiento}
            onChange={actualizarDato}
            required
          />

          <BotonPrimario type="submit">
            Siguiente →
          </BotonPrimario>
        </form>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-5">
          <SelectFormulario
            id="genero"
            name="genero"
            label="Género"
            value={datos.genero}
            onChange={actualizarDato}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="O">Otro</option>
          </SelectFormulario>

          <SelectFormulario
            id="preferencia_genero"
            name="preferencia_genero"
            label="Me interesan"
            value={datos.preferencia_genero}
            onChange={actualizarDato}
            required
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
            required
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
              required
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
            required
          />

          {mensajeError && (
            <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">
              {mensajeError}
            </p>
          )}

          <BotonPrimario type="submit" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </BotonPrimario>

          <button
            type="button"
            onClick={() => setPaso(1)}
            className="text-sm text-gray-400 hover:text-gray-600 text-center"
          >
            ← Volver
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-rose-500 font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default FormularioRegistro;
