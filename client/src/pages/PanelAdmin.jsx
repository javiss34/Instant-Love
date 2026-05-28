import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin.js";
import useSesion from "../hooks/useSesion.js";

const etiquetaRol = { USER: "Usuario", ADMIN: "Admin" };

const BadgeRol = ({ rol }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
    rol === "ADMIN"
      ? "bg-rose-100 text-rose-600"
      : "bg-gray-100 text-gray-500"
  }`}>
    {etiquetaRol[rol]}
  </span>
);

const PanelAdmin = () => {
  const { usuarios, cargando, cargarUsuarios, cambiarRol } = useAdmin();
  const { usuario: sesion } = useSesion();
  const [cambiando, setCambiando] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

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

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Panel de administración</h1>
          <p className="text-gray-500 mt-2">Gestiona los usuarios de la plataforma.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-center text-gray-400 text-lg animate-pulse">Cargando usuarios...</p>
        ) : (
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
                {usuarios.map((u) => {
                  const inicial = (u.Profile?.nombre ?? u.username)?.[0]?.toUpperCase();
                  const esSelf = u.id === sesion?.id;
                  return (
                    <tr key={u.id} className="border-b border-rose-50 last:border-0 hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {inicial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{u.Profile?.nombre ?? "—"}</p>
                            <p className="text-gray-400 text-xs">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        {esSelf ? (
                          <BadgeRol rol={u.rol} />
                        ) : (
                          <select
                            value={u.rol}
                            disabled={cambiando === u.id}
                            onChange={(e) => handleRol(u.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-100 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
                          >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/usuarios/${u.id}`}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          Ver detalle →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PanelAdmin;
