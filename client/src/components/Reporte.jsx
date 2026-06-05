import { Link } from "react-router-dom";
/* Componente que muestra la información de un reporte de moderación */
const Reporte = ({ reporte, mostrarDestino = false }) => {
  //A cada estado le ponemos un color representativo
  const coloresEstado = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    REVISADO: "bg-blue-100 text-blue-700",
    SANCIONADO: "bg-red-100 text-red-600",
  };
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm border border-rose-100">
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-medium text-sm">{reporte.motivo}</p>
        <p className="text-gray-400 text-xs mt-1">
          {/* Si mostrar destino es true, se muestra quien acusa a quien  */}
          {mostrarDestino ? (
            <>
              <span className="font-semibold">
                @{reporte.Autor?.username ?? "—"}
              </span>
              {" → "}
              <Link
                to={`/admin/usuarios/${reporte.acusadoId}`}
                className="font-semibold text-rose-500 hover:underline"
              >
                @{reporte.Destino?.username ?? "—"}
              </Link>
            </>
          ) : (
            <>
              Reportado por{" "}
              <span className="font-semibold">
                @{reporte.Autor?.username ?? "usuario eliminado"}
              </span>
            </>
          )}
          {" · "}
          {new Date(reporte.createdAt).toLocaleDateString("es-ES")}
        </p>
        {/* Si el administrador ha dejado una nota se muestra */}
        {reporte.nota_revision && (
          <p className="mt-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 inline-block">
            📝 {reporte.nota_revision}
          </p>
        )}
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${coloresEstado[reporte.estado]}`}
      >
        {reporte.estado}
      </span>
    </div>
  );
};

export default Reporte;
