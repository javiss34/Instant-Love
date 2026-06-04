import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin.js";
import Reporte from "../components/Reporte.jsx";
import EtiquetaRol from "../components/EtiquetaRol.jsx";

const DetalleUsuario = () => {
  const { id } = useParams();
  const { obtenerDetalle } = useAdmin();
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerDetalle(id);
        setDetalle(datos);
      } catch {
        setError("No se pudo cargar el detalle del usuario.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <p className="text-rose-400 text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const inicial = detalle.username?.[0]?.toUpperCase();

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20">

        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-500 transition-colors mb-8"
        >
          ← Volver al panel
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 mb-6 flex items-center gap-6">
          <img
            src={detalle.foto}
            alt={detalle.username}
            className="w-20 h-20 rounded-full object-cover shadow-md shrink-0"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">@{detalle.username}</h1>
            <p className="text-gray-400 mt-1">{detalle.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <EtiquetaRol rol={detalle.rol} />
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                detalle.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
              }`}>
                {detalle.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">
            Reportes recibidos ({detalle.reportes.length})
          </h2>

          {detalle.reportes.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Este usuario no tiene reportes.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {detalle.reportes.map((r) => (
                <Reporte key={r.id} reporte={r} />
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default DetalleUsuario;
