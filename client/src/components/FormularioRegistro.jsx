import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/authService.js";
import InputFormulario from "./ui/InputFormulario.jsx";
import SelectFormulario from "./ui/SelectFormulario.jsx";
import BotonPrimario from "./ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";

const FormularioRegistro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [preferenciaGenero, setPreferenciaGenero] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await registrarUsuario({
        nombre,
        email,
        password,
        fecha_nacimiento: fechaNacimiento,
        genero,
        preferencia_genero: preferenciaGenero,
      });
      navegar("/login");
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
        <p className="text-gray-500 mt-2 text-sm">Crea tu cuenta y empieza a conocer gente</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputFormulario
          id="nombre"
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          required
        />

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
          placeholder="Mínimo 6 caracteres"
          required
        />

        <InputFormulario
          id="fechaNacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
        />

        <SelectFormulario
          id="genero"
          label="Género"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="H">Hombre</option>
          <option value="M">Mujer</option>
          <option value="O">Otro</option>
        </SelectFormulario>

        <SelectFormulario
          id="preferenciaGenero"
          label="Me interesan"
          value={preferenciaGenero}
          onChange={(e) => setPreferenciaGenero(e.target.value)}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="H">Hombres</option>
          <option value="M">Mujeres</option>
          <option value="AMBOS">Ambos</option>
        </SelectFormulario>

        {error && (
          <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3">
            {error}
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
