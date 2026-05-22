import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import InputFormulario from "../components/ui/InputFormulario.jsx";
import SelectFormulario from "../components/ui/SelectFormulario.jsx";
import BotonPrimario from "../components/ui/BotonPrimario.jsx";
import logo from "../assets/logo-instant-love.png";

const registroInicial = {
  username: "",
  nombre: "",
  email: "",
  password: "",
  fecha_nacimiento: "",
  genero: "",
  preferencia_genero: "",
};

const Registro = () => {
  const [formData, setFormData] = useState(registroInicial);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { registro } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await registro(formData);
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
    <div
      className="flex-1 flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "#fdf2f8",
        backgroundImage: "radial-gradient(circle, #fda4af 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="InstantLove" className="h-16 w-16 rounded-2xl shadow-md mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-rose-500">InstantLove</h1>
          <p className="text-gray-500 mt-2 text-sm">Crea tu cuenta y empieza a conocer gente</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputFormulario
            id="username"
            label="Nombre de usuario"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="ej: juan_lopez"
            required
          />

          <InputFormulario
            id="nombre"
            label="Nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />

          <InputFormulario
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />

          <InputFormulario
            id="password"
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <InputFormulario
            id="fecha_nacimiento"
            label="Fecha de nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />

          <SelectFormulario
            id="genero"
            label="Género"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="O">Otro</option>
          </SelectFormulario>

          <SelectFormulario
            id="preferencia_genero"
            label="Me interesan"
            value={formData.preferencia_genero}
            onChange={handleChange}
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
    </div>
  );
};

export default Registro;
