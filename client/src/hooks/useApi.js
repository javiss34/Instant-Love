import { useState } from "react";

const useApi = () => {
  const errorInicial = "";
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(errorInicial);

  const ejecutar = async (promesa) => {
    setCargando(true);
    setError(errorInicial);
    try {
      return await promesa;
    } catch (e) {
      const mensaje = e?.response?.data?.mensaje ?? e?.message ?? "Error desconocido";
      setError(mensaje);
      throw e;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, ejecutar };
};

export default useApi;
