import { useState } from "react";
import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";

const datosLoginInicial = {
  email: "",
  password: "",
};

const FormularioLogin = () => {
  const [datos, setDatos] = useState(datosLoginInicial);
  const [mensajeError, setMensajeError] = useState(null);
  const { iniciarSesion, cargando } = useSesion();

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setMensajeError(null);
    setDatos({ ...datos, [name]: value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    try {
      await iniciarSesion(datos);
      setDatos(datosLoginInicial);
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
          Inicia sesión para continuar
        </p>
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-5">
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
          placeholder="••••••••"
          required
        />

        {mensajeError && (
          <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">
            {mensajeError}
          </p>
        )}

        <BotonPrimario type="submit" disabled={cargando}>
          {cargando ? "Entrando..." : "Entrar"}
        </BotonPrimario>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link
          to="/registro"
          className="text-rose-500 font-medium hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default FormularioLogin;
