import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("");

  const obtenerSaludo = async () => {
    try {
      const respuesta = await axios.get("http://localhost:3000/api/saludo");
        setMensaje(respuesta.data.mensaje);
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    obtenerSaludo();
  }, []);

  return (
    <>
      <h1>{mensaje}</h1>
    </>
  );
}

export default App;
