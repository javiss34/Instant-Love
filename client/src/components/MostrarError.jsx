//Componente que recibe un objeto de errores y muestra la lista de errores
const MostrarError = ({ objetoErrores }) => {
  //De la siguiente forma extraemos los valores del objeto y filtramos eliminando los que estan vacios.
  const erroresReales = Object.values(objetoErrores).filter((e) => e);
  if (erroresReales.length === 0) return null; //Si no hay errores salimos
  return (
    <div className="flex flex-col gap-1">
      {erroresReales.map((e, i) => (
        <p
          key={i}
          className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-2 px-3"
        >
          {e}
        </p>
      ))}
    </div>
  );
};

export default MostrarError;
