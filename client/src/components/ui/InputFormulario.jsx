const InputFormulario = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-4 py-2.5 border rounded-xl outline-none transition-colors text-gray-800 placeholder-gray-400
          focus:ring-2 focus:ring-rose-300 focus:border-rose-400
          ${error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-white hover:border-rose-300"
          }`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default InputFormulario;
