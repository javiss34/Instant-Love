import { useState } from "react";

const useApi = () => {
  const errorInicial = "";
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(errorInicial);

  //Esta función recibe la promesa de Axios
  const ejecutar = async (promesa) => {
    setCargando(true);
    setError(errorInicial);
    try {
      const datos = await promesa;
      return datos;
    } catch (e) {
      //Este mensaje está hecho para intentar dar el mensaje más preciso posible
      //Si por ejemplo es un fallo de validación del servidor, como contraseña incorrecta devuelve el error en e.response.data.mensaje
      //Si es un fallo por ejemplo de internet devuelve e.message
      //Sino Error desconocido
      const mensaje =
        e?.response?.data?.mensaje || e?.message || "Error desconocido";
      setError(mensaje);
      throw e;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, ejecutar };
};

export default useApi;
