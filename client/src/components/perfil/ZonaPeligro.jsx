import BotonPrimario from "../ui/BotonPrimario.jsx";

//Componente que encapsula la zona de los botones editar y eliminar del apartado Perfil
const ZonaPeligro = ({
  confirmandoEliminar,
  onIniciarEdicion,
  onIniciarEliminacion,
  onCancelarEliminacion,
  eliminarCuenta,
  cargandoSesion,
}) => {
  return (
    <div className="pt-6 mt-2 border-t border-gray-100">
      {!confirmandoEliminar ? (
        /* Botones normales */
        <div className="flex flex-wrap gap-3 items-center">
          <BotonPrimario
            variante="secundario"
            onClick={onIniciarEdicion}
            className="flex-1 sm:flex-none px-6"
          >
            ✏️ Editar perfil
          </BotonPrimario>
          <BotonPrimario
            variante="peligro"
            onClick={onIniciarEliminacion}
            className="flex-1 sm:flex-none px-6"
          >
            Eliminar cuenta
          </BotonPrimario>
        </div>
      ) : (
        /* Confirmación inline roja */
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <p className="text-gray-800 font-bold mb-1">
            ¿Seguro que quieres eliminar tu cuenta?
          </p>
          <p className="text-gray-500 text-sm mb-5">
            Esta acción borrará todos tus datos de forma permanente.
          </p>
          <div className="flex flex-wrap gap-3">
            <BotonPrimario
              variante="peligro"
              onClick={eliminarCuenta}
              disabled={cargandoSesion}
              className="flex-1 sm:flex-none px-6"
            >
              {cargandoSesion ? "Eliminando..." : "Sí, eliminar"}
            </BotonPrimario>
            <BotonPrimario
              variante="secundario"
              onClick={onCancelarEliminacion}
              className="flex-1 sm:flex-none px-6"
            >
              Cancelar
            </BotonPrimario>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonaPeligro;
