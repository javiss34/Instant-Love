//Componente que sirve para distinguir entre roles de usuarios
const EtiquetaRol = ({ rol }) => {
  //traducimos el valor que viene del backend por su palabra completa
  const etiquetas = { USER: "Usuario", ADMIN: "Administrador" };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        rol === "ADMIN"
          ? "bg-rose-100 text-rose-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {/* Accedemos a la palabra que hemos traducido */}
      {etiquetas[rol]}
    </span>
  );
};

export default EtiquetaRol;
