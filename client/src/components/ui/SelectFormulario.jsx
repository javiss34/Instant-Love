const SelectFormulario = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`px-4 py-2.5 border rounded-xl outline-none transition-colors text-gray-800 cursor-pointer
          focus:ring-2 focus:ring-rose-300 focus:border-rose-400
          ${error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-white hover:border-rose-300"
          }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default SelectFormulario;
