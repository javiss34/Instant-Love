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
};

const FormularioRegistro = () => {
  const [datos, setDatos] = useState(datosRegistroInicial);
  const [mensajeError, setMensajeError] = useState(null);
  const { registrar, cargando } = useSesion();

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setMensajeError(null);
    setDatos({ ...datos, [name]: value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    try {
      await registrar(datos);
      setDatos(datosRegistroInicial);
    } catch (err) {
      if (err.name === "ZodError") {
        setMensajeError(err.errors[0].message);
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
          Crea tu cuenta y empieza a conocer gente
        </p>
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-5">
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

        {mensajeError && (
          <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">
            {mensajeError}
          </p>
        )}

        <BotonPrimario type="submit" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </BotonPrimario>
      </form>

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
