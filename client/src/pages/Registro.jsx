import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import FormularioRegistro from "../components/FormularioRegistro.jsx";

const Registro = () => {
  const { sesionIniciada } = useSesion();

  if (sesionIniciada) {
    return <Navigate to="/inicio" replace />;
  }

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "#fdf2f8",
        backgroundImage:
          "radial-gradient(circle, #fda4af 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <FormularioRegistro />
    </div>
  );
};

export default Registro;
