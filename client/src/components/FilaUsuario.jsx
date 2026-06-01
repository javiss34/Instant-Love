import { Link } from "react-router-dom";
import EtiquetaRol from "./EtiquetaRol.jsx";

const FilaUsuario = ({ usuario, esSelf, cambiando, onCambiarRol }) => {
  const inicial = (usuario.Profile?.nombre ?? usuario.username)?.[0]?.toUpperCase();

  return (
    <tr className="border-b border-rose-50 last:border-0 hover:bg-rose-50/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {usuario.Profile?.foto ? (
            <img
              src={usuario.Profile.foto}
              alt={inicial}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {inicial}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{usuario.Profile?.nombre ?? "—"}</p>
            <p className="text-gray-400 text-xs">@{usuario.username}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
      <td className="px-6 py-4">
        {esSelf ? (
          <EtiquetaRol rol={usuario.rol} />
        ) : (
          <select
            value={usuario.rol}
            disabled={cambiando}
            onChange={(e) => onCambiarRol(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-100 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </td>
      <td className="px-6 py-4 text-gray-400 text-xs">
        {new Date(usuario.createdAt).toLocaleDateString("es-ES")}
      </td>
      <td className="px-6 py-4">
        <Link
          to={`/admin/usuarios/${usuario.id}`}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
        >
          Ver detalle →
        </Link>
      </td>
    </tr>
  );
};

export default FilaUsuario;
