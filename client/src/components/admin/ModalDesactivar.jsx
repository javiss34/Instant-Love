/* Modal de confirmación para activar o desactivar la cuenta de un usuario. */
const ModalDesactivar = ({ datos, onConfirmar, onCancelar }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-desactivar-titulo"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
        <p className="text-3xl mb-3">{datos.activo ? "🔒" : "🔓"}</p>
        <h2
          id="modal-desactivar-titulo"
          className="text-gray-800 font-bold text-lg mb-2"
        >
          {datos.activo ? "¿Desactivar esta cuenta?" : "¿Activar esta cuenta?"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {datos.activo ? (
            <>
              El usuario{" "}
              <span className="font-semibold text-gray-600">
                @{datos.username}
              </span>{" "}
              no podrá iniciar sesión hasta que se reactive.
            </>
          ) : (
            <>
              El usuario{" "}
              <span className="font-semibold text-gray-600">
                @{datos.username}
              </span>{" "}
              recuperará el acceso a la plataforma.
            </>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirmar}
            className={`flex-1 text-white font-semibold py-3 rounded-xl transition-colors text-sm w-full ${
              datos.activo
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {datos.activo ? "Sí, desactivar" : "Sí, activar"}
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm w-full"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDesactivar;