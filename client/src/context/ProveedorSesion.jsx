import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiClient,
  guardarToken,
  borrarToken,
  leerToken,
} from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoSesion = createContext(null);

const ProveedorSesion = ({ children }) => {
  const usuarioInicial = null;
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const { ejecutar, cargando, error } = useApi();
  const navegar = useNavigate();

  const verificarSesion = async () => {
    //Si no hay token en el navegadro, se sale directamente
    if (!leerToken()) {
      setCargandoSesion(false);
      return;
    }
    try {
      //Si hay token, se piden los datos del peril al backend, para constuir la sesión.
      const respuesta = await apiClient.get("/perfil/");
      const perfil = respuesta.perfil;
      setUsuario({
        id: perfil.id,
        username: perfil.User.username,
        email: perfil.User.email,
        rol: perfil.User.rol,
      });
    } catch {
      //Si el servidor da error cerramos la sesión
      borrarToken();
      setUsuario(usuarioInicial);
    } finally {
      setCargandoSesion(false);
    }
  };

  //Al cargar el navegador por primera vez, se ejecuta el verificarSesion().
  useEffect(() => {
    verificarSesion();
  }, []);


  //Aquí tenemos las funciones para inicar sesión, registra, cerrarSesion y eliminarCuenta
  const iniciarSesion = async (datos) => {
    const respuesta = await ejecutar(
      apiClient.post("/auth/iniciar-sesion", datos),
    );
    //Se guarda el token en el navegador y los datos en la memoria.
    guardarToken(respuesta.token);
    setUsuario(respuesta.usuario);
    navegar("/inicio"); //Redirigimos al usuario a Inicio
  };

  const registrar = async (datos) => {
    await ejecutar(apiClient.post("/auth/registrar", datos));
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
    sesionIniciada: usuario !== null,//De esta forma comprobamos rápidamente si está la sesión iniciada o no, sin necesidad de crear otro estado
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
