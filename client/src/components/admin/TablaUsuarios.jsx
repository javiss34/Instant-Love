import FilaUsuario from "../FilaUsuario.jsx";

/* Componente que renderiza la tabla usuarios en el panel admin */
const TablaUsuarios = ({
  usuarios,
  cargando,
  sesionId,
  cambiando,
  cambiandoActivo,
  onCambiarRol,
  onSolicitarCambioActivo,
}) => {
  if (cargando && usuarios.length === 0) {
    return (
      <p className="text-center text-gray-400 text-lg animate-pulse">
        Cargando...
      </p>
    );
  }

  return (
    
    <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-x-auto">
      
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-rose-100 text-left">
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Usuario
            </th>
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email
            </th>
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Rol
            </th>
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Registro
            </th>
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Estado
            </th>
            <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <FilaUsuario
              key={u.id}
              usuario={u}
              esSelf={u.id === sesionId}
              cambiando={cambiando === u.id}
              cambiandoActivo={cambiandoActivo === u.id}
              onCambiarRol={(nuevoRol) => onCambiarRol(u.id, nuevoRol)}
              onSolicitarCambioActivo={() => onSolicitarCambioActivo(u)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;