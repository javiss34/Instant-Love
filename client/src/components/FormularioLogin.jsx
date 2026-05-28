import { useState } from "react";
import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import { esquemaLogin } from "../biblioteca/validaciones/sesionEsquemas.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import MostrarError from "./MostrarError.jsx";
import logo from "../assets/logo-instant-love.png";

//Muy parecido al de registro, allí ya lo explico todo
const FormularioLogin = () => {
  const datosLoginInicial = {
    email: "",
    password: "",
  };
  const [datos, setDatos] = useState(datosLoginInicial);
  const [errores, setErrores] = useState({});
  const { iniciarSesion, cargando } = useSesion();

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setErrores({});
    setDatos({ ...datos, [name]: value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrores({});

    try {
      const resultado = esquemaLogin.safeParse(datos);
      if (!resultado.success) {
        const nuevosErrores = {};
        resultado.error.issues.forEach(({ path, message }) => {
          nuevosErrores[path[0]] = message;
        });
        setErrores(nuevosErrores);
        return;
      }
      await iniciarSesion(resultado.data);
      setDatos(datosLoginInicial);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje ?? "Error inesperado.";
      if (mensaje.toLowerCase().includes("email")) {
        setErrores({ email: mensaje });
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
          error={errores.email}
        />

        <InputFormulario
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          value={datos.password}
          onChange={actualizarDato}
          placeholder="••••••••"
          error={errores.password}
        />

        <MostrarError objetoErrores={{ general: errores.general }} />

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
