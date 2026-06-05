import { createContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";
import useSesion from "../hooks/useSesion.js";

const ContextoPerfiles = createContext(null);

const ProveedorPerfiles = ({ children }) => {
  const perfilInicial = null;
  const [perfilPropio, setPerfilPropio] = useState(perfilInicial);

  const { sesionIniciada } = useSesion();
  const { ejecutar, cargando, error } = useApi();

  const obtenerPerfilPropio = async () => {
    const respuesta = await ejecutar(apiClient.get("/perfil/"));
    if (respuesta?.perfil) {
      setPerfilPropio(respuesta.perfil);
    }
  };

  const actualizarPerfilPropio = async (datos) => {
    const respuesta = await ejecutar(apiClient.put("/perfil/", datos));
    if (respuesta?.perfil) {
      setPerfilPropio(respuesta.perfil);
      return true;
    }
    return false;
  };

  const subirFotoPerfil = async (archivo) => {
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    //Como es una llamada externa en vez de a apiClient, utilizamos fetch
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const datos = await res.json();
    if (!datos.secure_url) throw new Error("Cloudinary no devolvió URL");
    await actualizarPerfilPropio({ foto: datos.secure_url });
  };

  //Cuando el usuario inicia sesión cargamos su perfil; cuando la cierra lo limpiamos
  useEffect(() => {
    if (sesionIniciada) {
      obtenerPerfilPropio();
    } else {
      setPerfilPropio(perfilInicial);
    }
  }, [sesionIniciada]);

  const datosAProveer = {
    perfilPropio,
    cargando,
    error,
    obtenerPerfilPropio,
    actualizarPerfilPropio,
    subirFotoPerfil,
  };

  return (
    <ContextoPerfiles.Provider value={datosAProveer}>
      {children}
    </ContextoPerfiles.Provider>
  );
};

export default ProveedorPerfiles;
export { ContextoPerfiles };
