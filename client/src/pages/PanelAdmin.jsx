import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin.js";
import useSesion from "../hooks/useSesion.js";
import FilaUsuario from "../components/FilaUsuario.jsx";

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
                {usuarios.map((u) => (
                  <FilaUsuario
                    key={u.id}
                    usuario={u}
                    esSelf={u.id === sesion?.id}
                    cambiando={cambiando === u.id}
                    onCambiarRol={(nuevoRol) => handleRol(u.id, nuevoRol)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </div>
  );
};

export default PanelAdmin;
