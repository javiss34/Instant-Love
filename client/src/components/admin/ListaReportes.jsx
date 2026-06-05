//Se declaran fuera del componente por cuestión de rendimiento
const ESTADOS = ["PENDIENTE", "REVISADO", "SANCIONADO"];

const coloresEstado = {
  PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVISADO: "bg-blue-100 text-blue-700 border-blue-200",
  SANCIONADO: "bg-red-100 text-red-600 border-red-200",
};

//Componente para listar reportes
const ListaReportes = ({ reportes, cambiandoReporte, abrirCambioEstado }) => {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🚨 Reportes</h2>

      {reportes.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No hay reportes registrados.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reportes.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-rose-100"
            >
              {/* Información del reporte */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium text-sm">{r.motivo}</p>
                <p className="text-gray-400 text-xs mt-1">
                  <span className="font-semibold">
                    @{r.Autor?.username ?? "—"}
                  </span>
                  {" → "}
                  <span className="font-semibold text-rose-500">
                    @{r.Destino?.username ?? "—"}
                  </span>
                  {" · "}
                  {new Date(r.createdAt).toLocaleDateString("es-ES")}
                </p>
                {r.nota_revision && (
                  <p className="mt-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 inline-block">
                    📝 {r.nota_revision}
                  </p>
                )}
              </div>

              {/* Botones de estado */}
              <div className="flex gap-2 shrink-0">
                {ESTADOS.map((estado) => (
                  <button
                    key={estado}
                    disabled={cambiandoReporte === r.id || r.estado === estado}
                    onClick={() => abrirCambioEstado(r.id, estado)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity ${
                      r.estado === estado
                        ? coloresEstado[estado]
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                    } ${
                      cambiandoReporte === r.id || r.estado === estado
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
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
  );
};

export default ListaReportes;
