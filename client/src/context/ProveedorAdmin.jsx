import { createContext, useState } from "react";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoAdmin = createContext(null);

const ProveedorAdmin = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [reportes, setReportes] = useState([]);
  const { ejecutar, cargando } = useApi();

  const cargarUsuarios = async () => {
    const datos = await ejecutar(apiClient.get("/admin/usuarios"));
    if (datos) setUsuarios(datos);
  };

  const cambiarRol = async (userId, rol) => {
    await ejecutar(apiClient.put(`/admin/usuarios/${userId}/rol`, { rol }));
    setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, rol } : u)));
  };

  const obtenerDetalle = (userId) =>
    ejecutar(apiClient.get(`/admin/usuarios/${userId}`));

  const cargarReportes = async () => {
    const datos = await ejecutar(apiClient.get("/reportes"));
    if (datos) setReportes(datos);
  };

  const cambiarEstadoReporte = async (reporteId, estado) => {
    const actualizado = await ejecutar(
      apiClient.patch(`/reportes/${reporteId}/estado`, { estado }),
    );
    if (actualizado) {
      setReportes((prev) =>
        prev.map((r) => (r.id === reporteId ? { ...r, estado } : r)),
      );
    }
  };

  const datosAProveer = {
    usuarios,
    reportes,
    cargando,
    cargarUsuarios,
    cambiarRol,
    obtenerDetalle,
    cargarReportes,
    cambiarEstadoReporte,
  };

  return (
    <ContextoAdmin.Provider value={datosAProveer}>
      {children}
    </ContextoAdmin.Provider>
  );
};

export default ProveedorAdmin;
export { ContextoAdmin };
