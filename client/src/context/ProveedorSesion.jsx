import { createContext, useState, useEffect } from "react";
import api from "../biblioteca/api.js";

const SesionContext = createContext(null);

const ProveedorSesion = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const tokenGuardado = localStorage.getItem("token");

      if (!tokenGuardado) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await api.get("/perfil/");
        const perfil = respuesta.data.perfil;
        setToken(tokenGuardado);
        setUsuario({
          id: perfil.id,
          email: perfil.User.email,
          rol: perfil.User.rol,
        });
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  const guardarSesion = (datosUsuario, nuevoToken) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <SesionContext.Provider
      value={{ usuario, token, cargando, guardarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  );
};

export { SesionContext, ProveedorSesion };
