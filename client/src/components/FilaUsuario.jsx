import { Link } from "react-router-dom";
import EtiquetaRol from "./EtiquetaRol.jsx";

/* Este componente es para cada fila de cada usuario que podrá ver el admin en su sección */
const FilaUsuario = ({ usuario, esSelf, cambiando, cambiandoActivo, onCambiarRol, onSolicitarCambioActivo }) => {
  return (
    <tr className="border-b border-rose-50 last:border-0 hover:bg-rose-50/30 transition-colors">
      {/* Columna 1: Avatar y nombre (Ajuste de padding: px-4 sm:px-6) */}
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={usuario.Profile?.foto}
            alt="Foto de perfil"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-semibold text-gray-800">{usuario.Profile?.nombre ?? "—"}</p>
            <p className="text-gray-400 text-xs">@{usuario.username}</p>
          </div>
        </div>
      </td>
      
      {/* Columna 2: Email */}
      <td className="px-4 sm:px-6 py-4 text-gray-600">{usuario.email}</td>
      
      {/* Columna 3: Roles */}
      <td className="px-4 sm:px-6 py-4">
        {esSelf ? (
          /* Si el administrador ve su propia fila no le dejamos cambiar su rol */
          <EtiquetaRol rol={usuario.rol} />
        ) : (
          <select
            value={usuario.rol}
            disabled={cambiando}
            onChange={(e) => onCambiarRol(e.target.value)}
            aria-label={`Rol de ${usuario.username}`}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-100 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </td>
      
      {/* Columna4: Fecha de registro formateada */}
      <td className="px-4 sm:px-6 py-4 text-gray-400 text-xs">
        {new Date(usuario.createdAt).toLocaleDateString("es-ES")}
      </td>
      
      {/* Columna 5: Activar / Desactivar */}
      <td className="px-4 sm:px-6 py-4">
        {esSelf ? (
          <span className="text-xs text-gray-300 font-medium">—</span>
        ) : (
          <button
            onClick={onSolicitarCambioActivo}
            disabled={cambiandoActivo}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              usuario.activo
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            {cambiandoActivo ? "..." : usuario.activo ? "Desactivar" : "Activar"}
          </button>
        )}
      </td>
      
      {/* Columna 6: Ver detalle */}
      <td className="px-4 sm:px-6 py-4">
        <Link
          to={`/admin/usuarios/${usuario.id}`}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors whitespace-nowrap"
        >
          Ver detalle →
        </Link>
      </td>
    </tr>
  );
};

export default FilaUsuario;