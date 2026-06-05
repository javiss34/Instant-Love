import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import FormularioLogin from "../components/FormularioLogin.jsx";

//Muestra la página del inicio de sesión
const Login = () => {
  const { sesionIniciada } = useSesion();

  //Si un usuario que ya esta logeado intenta ir al login lo mandamos de vuelta a Inicio
  if (sesionIniciada) {
    return <Navigate to="/inicio" replace />;//El replace sustituye la página actual en el historial del navegador
  }

  return (
    <div
      className="flex-1 flex items-center justify-center px-4"
      style={{
        backgroundColor: "#fdf2f8",
        backgroundImage:
          "radial-gradient(circle, #fda4af 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <FormularioLogin />
    </div>
  );
};

export default Login;
