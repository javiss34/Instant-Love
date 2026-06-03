//Componente que encapsula la lógica visual de un campo de formulario, para no estar repetitiendo el mismo código en los formularios
const InputFormulario = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error, //si recibe un string con un error, el input se pintará de rojo automáticamente
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {/* De esta forma nos ahorramos poner las etiquetas label cada vez que hacemos un input */}
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name ?? id} /* Si no nos pasan el name, usamos el id por defecto */
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        /* Si hay un error, se pinta rojo. Si no, borde gris normal. */
        className={`px-4 py-2.5 border rounded-xl outline-none transition-colors text-gray-800 placeholder-gray-400
          focus:ring-2 focus:ring-rose-300 focus:border-rose-400
          ${
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 bg-white hover:border-rose-300"
          }`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default InputFormulario;
