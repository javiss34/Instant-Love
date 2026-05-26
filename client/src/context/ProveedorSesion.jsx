import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, guardarToken, borrarToken, leerToken } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";
import {
  esquemaLogin,
  esquemaRegistro,
} from "../biblioteca/validaciones/sesionEsquemas.js";

const ContextoSesion = createContext(null);

const ProveedorSesion = ({ children }) => {
  const usuarioInicial = null;
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const { ejecutar, cargando, error } = useApi();
  const navegar = useNavigate();

  const verificarSesion = async () => {
    if (!leerToken()) {
      setCargandoSesion(false);
      return;
    }
    try {
      const respuesta = await apiClient.get("/perfil/");
      const perfil = respuesta.perfil;
      setUsuario({
        id: perfil.id,
        username: perfil.User.username,
        email: perfil.User.email,
        rol: perfil.User.rol,
      });
    } catch {
      borrarToken();
      setUsuario(usuarioInicial);
    } finally {
      setCargandoSesion(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  const iniciarSesion = async (datos) => {
    const datosValidados = esquemaLogin.parse(datos);
    const respuesta = await ejecutar(
      apiClient.post("/auth/iniciar-sesion", datosValidados),
    );
    guardarToken(respuesta.token);
    setUsuario(respuesta.usuario);
    navegar("/inicio");
  };

  const registrar = async (datos) => {
    const datosValidados = esquemaRegistro.parse(datos);
    await ejecutar(apiClient.post("/auth/registrar", datosValidados));
    navegar("/login");
  };

  const cerrarSesion = () => {
    borrarToken();
    setUsuario(usuarioInicial);
    navegar("/login");
  };

  const eliminarCuenta = async () => {
    await ejecutar(apiClient.delete("/auth/cuenta"));
    borrarToken();
    setUsuario(usuarioInicial);
    navegar("/login");
  };

  const datosAProveer = {
    usuario,
    sesionIniciada: usuario !== null,
    cargandoSesion,
    cargando,
    error,
    iniciarSesion,
    registrar,
    cerrarSesion,
    eliminarCuenta,
  };

  return (
    <ContextoSesion.Provider value={datosAProveer}>
      {children}
    </ContextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { ContextoSesion };
