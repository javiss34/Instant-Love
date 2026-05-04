const BotonPrimario = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variante = "primario",
  className = "",
}) => {
  const estilosBase =
    "w-full py-3 px-6 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const estilosPorVariante = {
    primario:
      "bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white shadow-md",
    secundario:
      "bg-white border border-rose-300 text-rose-500 hover:bg-rose-50 shadow-sm",
    peligro:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${estilosBase} ${estilosPorVariante[variante]} ${className}`}
    >
      {children}
    </button>
  );
};

export default BotonPrimario;
