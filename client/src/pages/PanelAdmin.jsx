import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin.js";
import useSesion from "../hooks/useSesion.js";
import FilaUsuario from "../components/FilaUsuario.jsx";

const ESTADOS = ["PENDIENTE", "REVISADO", "SANCIONADO"];

const coloresEstado = {
  PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVISADO: "bg-blue-100 text-blue-700 border-blue-200",
  SANCIONADO: "bg-red-100 text-red-600 border-red-200",
};

const PanelAdmin = () => {
  const { usuarios, reportes, cargando, cargarUsuarios, cambiarRol, cambiarActivo, cargarReportes, cambiarEstadoReporte } = useAdmin();
  const { usuario: sesion } = useSesion();
  const [cambiando, setCambiando] = useState(null);
  const [cambiandoActivo, setCambiandoActivo] = useState(null);
  const [cambiandoReporte, setCambiandoReporte] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
    cargarReportes();
  }, []);

  const handleActivo = async (userId) => {
    setCambiandoActivo(userId);
    setError(null);
    try {
      await cambiarActivo(userId);
    } catch (err) {
      setError(err.response?.data?.mensaje ?? "Error al cambiar el estado de la cuenta");
    } finally {
      setCambiandoActivo(null);
    }
  };

  const handleRol = async (userId, nuevoRol) => {
    setCambiando(userId);
    setError(null);
    try {
      await cambiarRol(userId, nuevoRol);
    } catch (err) {
      setError(err.response?.data?.mensaje ?? "Error al cambiar el rol");
    } finally {
      setCambiando(null);
    }
  };

  const handleEstadoReporte = async (reporteId, nuevoEstado) => {
    setCambiandoReporte(reporteId);
    try {
      await cambiarEstadoReporte(reporteId, nuevoEstado);
    } catch {
      // fallo silencioso: el badge no cambia si la petición falla
    } finally {
      setCambiandoReporte(null);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Panel de administración</h1>
          <p className="text-gray-500 mt-2">Gestiona los usuarios y los reportes de la plataforma.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Tabla de usuarios */}
        {cargando && usuarios.length === 0 ? (
          <p className="text-center text-gray-400 text-lg animate-pulse">Cargando...</p>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rose-100 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Usuario</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Rol</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Registro</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <FilaUsuario
                      key={u.id}
                      usuario={u}
                      esSelf={u.id === sesion?.id}
                      cambiando={cambiando === u.id}
                      cambiandoActivo={cambiandoActivo === u.id}
                      onCambiarRol={(nuevoRol) => handleRol(u.id, nuevoRol)}
                      onCambiarActivo={() => handleActivo(u.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sección de reportes */}
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🚨 Reportes</h2>

              {reportes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay reportes registrados.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {reportes.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-rose-100"
                    >
                      {/* Info del reporte */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium text-sm">{r.motivo}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          <span className="font-semibold">@{r.Autor?.username ?? "—"}</span>
                          {" → "}
                          <span className="font-semibold text-rose-500">@{r.Destino?.username ?? "—"}</span>
                          {" · "}
                          {new Date(r.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>

                      {/* Selector de estado */}
                      <div className="flex gap-2 shrink-0">
                        {ESTADOS.map((estado) => (
                          <button
                            key={estado}
                            disabled={cambiandoReporte === r.id}
                            onClick={() => handleEstadoReporte(r.id, estado)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity ${
                              r.estado === estado
                                ? coloresEstado[estado]
                                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                            } ${cambiandoReporte === r.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {estado}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </section>
    </div>
  );
};

export default PanelAdmin;
