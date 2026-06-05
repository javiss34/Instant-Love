/* Modal de confirmación de sanción. */
const ModalSancion = ({ onConfirmar, onCancelar }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sancion-titulo"
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <p className="text-3xl mb-3">⛔</p>
        <h2
          id="modal-sancion-titulo"
          className="text-gray-800 font-bold text-lg mb-2"
        >
          ¿Sancionar a este usuario?
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Su cuenta quedará{" "}
          <span className="font-semibold text-red-500">
            desactivada automáticamente
          </span>
          . Esta acción puede revertirse desde la tabla de usuarios.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirmar}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Sí, sancionar
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSancion;
