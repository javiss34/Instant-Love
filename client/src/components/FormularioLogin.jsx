import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { iniciarSesion } from "../services/authService.js";
import useSesion from "../hooks/useSesion.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";

const FormularioLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { guardarSesion } = useSesion();
  const navegar = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const datos = await iniciarSesion(email, password);
      guardarSesion(datos.usuario, datos.token);
      navegar("/inicio");
    } catch (err) {
      if (err.name === "ZodError") {
        setError(err.errors[0].message);
      } else if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <img src={logo} alt="InstantLove" className="h-16 w-16 rounded-2xl shadow-md mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-rose-500">InstantLove</h1>
        <p className="text-gray-500 mt-2 text-sm">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputFormulario
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />

        <InputFormulario
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">
            {error}
          </p>
        )}

        <BotonPrimario type="submit" disabled={cargando}>
          {cargando ? "Entrando..." : "Entrar"}
        </BotonPrimario>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="text-rose-500 font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default FormularioLogin;
