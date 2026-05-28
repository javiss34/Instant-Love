import { useState } from "react";
import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";
import {
  esquemaRegistro,
  esquemaRegistroPaso1,
} from "../biblioteca/validaciones/sesionEsquemas.js";
import MostrarError from "./MostrarError.jsx";


const FormularioRegistro = () => {
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
  const [datos, setDatos] = useState(datosRegistroInicial);
  //Ya que el formulario de registro tiene muchos campos, vamos a dividirlo en dos pantallas, la primera para datos de sesión y la segunda para datos de perfil.
  const [paso, setPaso] = useState(1); //Para eso sirve este estado.
  const [errores, setErrores] = useState({});
  const { registrar, cargando } = useSesion();

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setErrores({});
    setDatos({ ...datos, [name]: value });
  };

  const avanzar = (e) => {
    e.preventDefault();
    setErrores({});
    const resultado = esquemaRegistroPaso1.safeParse(datos);
    if (!resultado.success) {
      const nuevosErrores = {};
      resultado.error.issues.forEach(({ path, message }) => {
        nuevosErrores[path[0]] = message;
      });
      setErrores(nuevosErrores);
      return;
    }
    setPaso(2);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrores({});

    const datosAEnviar = { ...datos };

    try {
      //Si el usuario elige otra red social, aparece un campo extra
      if (datos.red_social_tipo === "OTRO") {
        //ya que en la base de datos solo existe una columna red_social_usuario, combinamos los dos campos antes de enviarlo al backend.
        datosAEnviar.red_social_usuario = `${datos.red_social_nombre}: ${datos.red_social_usuario}`;
      }

      const resultado = esquemaRegistro.safeParse(datosAEnviar);
      if (!resultado.success) {
        const nuevosErrores = {};
        //De esta forma recorremos los errores y los metemos en el objeto que acabamos de crear
        resultado.error.issues.forEach(({ path, message }) => {
          nuevosErrores[path[0]] = message;
        });
        setErrores(nuevosErrores);
        return;
      }
      await registrar(resultado.data);
      setDatos(datosRegistroInicial);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje ?? "Error inesperado.";
      //Como en el paso 1 no hay validación con el servidor, implementamos esta lógica:
      //Si llega un error del backend por el email, por ejemplo porque ya esta en uso, le llevamos de vuelta al paso1
      // y establecemos el error a email, para que se muestre rojo el input.
      if (mensaje.toLowerCase().includes("email")) {
        setPaso(1);
        setErrores({ email: mensaje });
      //Si llega un error del backend por el nombre de usuario, por ejemplo porque ya esta en uso, le llevamos de vuelta al paso1
      // y establecemos el error a usuario, para que se muestre rojo el input.
      } else if (mensaje.toLowerCase().includes("usuario")) {
        setPaso(1);
        setErrores({ username: mensaje });
      //Si es otro error se muestra en general, al final del formulario
      } else {
        setErrores({ general: mensaje });
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
          {paso === 1
            ? "Crea tu cuenta y empieza a conocer gente"
            : "Cuéntanos un poco más sobre ti"}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div
            className={`h-1.5 w-8 rounded-full ${paso === 1 ? "bg-rose-500" : "bg-rose-200"}`}
          />
          <div
            className={`h-1.5 w-8 rounded-full ${paso === 2 ? "bg-rose-500" : "bg-rose-200"}`}
          />
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
            error={errores.username}
          />

          <InputFormulario
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            value={datos.nombre}
            onChange={actualizarDato}
            placeholder="Tu nombre"
            error={errores.nombre}
          />

          <InputFormulario
            id="email"
            name="email"
            label="Email"
            type="email"
            value={datos.email}
            onChange={actualizarDato}
            placeholder="tu@email.com"
            error={errores.email}
          />

          <InputFormulario
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            value={datos.password}
            onChange={actualizarDato}
            placeholder="Mínimo 6 caracteres"
            error={errores.password}
          />

          <InputFormulario
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            label="Fecha de nacimiento"
            type="date"
            value={datos.fecha_nacimiento}
            onChange={actualizarDato}
            error={errores.fecha_nacimiento}
          />

          <MostrarError objetoErrores={{ general: errores.general }} />

          <BotonPrimario type="submit">Siguiente →</BotonPrimario>
        </form>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-5">
          <SelectFormulario
            id="genero"
            name="genero"
            label="Género"
            value={datos.genero}
            onChange={actualizarDato}
            error={errores.genero}
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
