const etiquetas = { USER: "Usuario", ADMIN: "Administrador" };

const EtiquetaRol = ({ rol }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
    rol === "ADMIN" ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-500"
  }`}>
    {etiquetas[rol]}
  </span>
);

export default EtiquetaRol;
