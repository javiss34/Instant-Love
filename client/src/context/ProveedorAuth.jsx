import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../biblioteca/api.js";
import { iniciarSesion, registrarUsuario } from "../services/authService.js";

const AuthContext = createContext(null);

const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  const navegar = useNavigate();

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
          username: perfil.User.username,
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

  const login = async (datos) => {
    const respuesta = await iniciarSesion(datos.email, datos.password);
    localStorage.setItem("token", respuesta.token);
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
    navegar("/inicio");
  };

  const registro = async (datos) => {
    await registrarUsuario(datos);
    navegar("/login");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, registro, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, ProveedorAuth };
