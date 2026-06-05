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

  const cambiarActivo = async (userId) => {
    const datos = await ejecutar(apiClient.patch(`/admin/usuarios/${userId}/activo`));
    if (datos) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, activo: datos.activo } : u)),
      );
    }
  };

  const obtenerDetalle = (userId) =>
    ejecutar(apiClient.get(`/admin/usuarios/${userId}`));

  const cargarReportes = async () => {
    const datos = await ejecutar(apiClient.get("/reportes"));
    if (datos) setReportes(datos);
  };

  const cambiarEstadoReporte = async (reporteId, estado, nota_revision) => {
    const actualizado = await ejecutar(
      apiClient.patch(`/reportes/${reporteId}/estado`, { estado, nota_revision }),
    );
    if (actualizado) {
      setReportes((prev) =>
        prev.map((r) =>
          r.id === reporteId
            ? { ...r, estado, nota_revision: actualizado.nota_revision ?? r.nota_revision }
            : r,
        ),
      );
      if (estado === "SANCIONADO") {
        const acusadoId = reportes.find((r) => r.id === reporteId)?.acusadoId;
        if (acusadoId) {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === acusadoId ? { ...u, activo: false } : u)),
          );
        }
      }
    }
  };

  const datosAProveer = {
    usuarios,
    reportes,
    cargando,
    cargarUsuarios,
    cambiarRol,
    cambiarActivo,
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
