import { createContext, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoAdmin = createContext(null);

const ProveedorAdmin = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { ejecutar } = useApi();

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const datos = await ejecutar(apiClient.get("/admin/usuarios"));
      setUsuarios(datos);
    } finally {
      setCargando(false);
    }
  };

  const cambiarRol = async (userId, rol) => {
    await ejecutar(apiClient.put(`/admin/usuarios/${userId}/rol`, { rol }));
    setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, rol } : u)));
  };

  const obtenerDetalle = (userId) =>
    ejecutar(apiClient.get(`/admin/usuarios/${userId}`));

  return (
    <ContextoAdmin.Provider value={{ usuarios, cargando, cargarUsuarios, cambiarRol, obtenerDetalle }}>
      {children}
    </ContextoAdmin.Provider>
  );
};

export default ProveedorAdmin;
export { ContextoAdmin };
