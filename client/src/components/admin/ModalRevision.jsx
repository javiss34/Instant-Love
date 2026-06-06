import { useState } from "react";

/* Modal para añadir la nota obligatoria al marcar un reporte como REVISADO. */
const ModalRevision = ({ onConfirmar, onCancelar }) => {
  const [nota, setNota] = useState("");
  const [errorNota, setErrorNota] = useState(null);

  const handleConfirmar = () => {
    if (!nota.trim()) {
      setErrorNota("La nota de revisión es obligatoria.");
      return;
    }
    onConfirmar(nota.trim());
  };

  const handleCambioNota = (e) => {
    setNota(e.target.value);
    setErrorNota(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-revision-titulo"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <h2
          id="modal-revision-titulo"
          className="text-gray-800 font-bold text-lg mb-1"
        >
          Añadir nota de revisión
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Explica qué acciones se tomaron o por qué se cierra este reporte.
        </p>
        <textarea
          value={nota}
          onChange={handleCambioNota}
          rows={4}
          placeholder="Describe la revisión realizada..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errorNota && <p className="text-red-500 text-xs mt-1">{errorNota}</p>}
        
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={handleConfirmar}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm w-full"
          >
            Confirmar revisión
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

export default ModalRevision;