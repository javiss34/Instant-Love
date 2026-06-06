import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin.js";
import useSesion from "../hooks/useSesion.js";
import TablaUsuarios from "../components/admin/TablaUsuarios.jsx";
import ListaReportes from "../components/admin/ListaReportes.jsx";
import ModalDesactivar from "../components/admin/ModalDesactivar.jsx";
import ModalRevision from "../components/admin/ModalRevision.jsx";
import ModalSancion from "../components/admin/ModalSancion.jsx";

/* Componente orquestador: gestiona estado, hooks y manejadores.
   Delega todo el renderizado en los componentes hijos. */
const PanelAdmin = () => {
  const {
    usuarios,
    reportes,
    cargando,
    cargarUsuarios,
    cambiarRol,
    cambiarActivo,
    cargarReportes,
    cambiarEstadoReporte,
  } = useAdmin();
  const { usuario: sesion } = useSesion();

  const [cambiando, setCambiando] = useState(null);
  const [cambiandoActivo, setCambiandoActivo] = useState(null);
  const [cambiandoReporte, setCambiandoReporte] = useState(null);
  const [error, setError] = useState(null);
  // Cada modal se abre pasando sus datos; null = cerrado
  const [modalDesactivar, setModalDesactivar] = useState(null);
  const [modalRevision, setModalRevision] = useState(null);    
  const [modalSancion, setModalSancion] = useState(null);       

  useEffect(() => {
    //Función dentro del useEffect para que solo se ejecute cuando se ejecuta el useEffect y no cada vez que se re-renderize la página
    const cargar = async () => {
      try {
        await cargarUsuarios();
        await cargarReportes();
      } catch {
        setError("No se pudieron cargar los datos del panel. Recarga la página.");
      }
    };
    cargar();
  }, []);

  //Maneja el cambio de rol
  const handleRol = async (userId, nuevoRol) => {
    setCambiando(userId);
    setError(null);
    try {
      await cambiarRol(userId, nuevoRol);
    } catch (err) {
      setError(err.response?.data?.mensaje ?? "Error al cambiar el rol");
    } finally {
      setCambiando(null);
    }
  };

  const confirmarDesactivar = async () => {
    const { userId } = modalDesactivar;
    setModalDesactivar(null);
    setCambiandoActivo(userId);
    setError(null);
    try {
      await cambiarActivo(userId);
    } catch (err) {
      setError(err.response?.data?.mensaje ?? "Error al cambiar el estado de la cuenta");
    } finally {
      setCambiandoActivo(null);
    }
  };


  // Decide si ejecutar directamente o abrir el modal correspondiente
  const abrirCambioEstado = (reporteId, nuevoEstado) => {
    if (nuevoEstado === "REVISADO") {
      setModalRevision({ reporteId });
      return;
    }
    if (nuevoEstado === "SANCIONADO") {
      setModalSancion({ reporteId });
      return;
    }
    ejecutarCambioEstado(reporteId, nuevoEstado);
  };

  const ejecutarCambioEstado = async (reporteId, nuevoEstado, nota_revision) => {
    setCambiandoReporte(reporteId);
    try {
      await cambiarEstadoReporte(reporteId, nuevoEstado, nota_revision);
    } catch (err) {
      setError(err.response?.data?.mensaje ?? "No se pudo actualizar el estado del reporte.");
    } finally {
      setCambiandoReporte(null);
    }
  };

  // ModalRevision emite la nota ya validada al confirmar
  const confirmarRevision = async (nota) => {
    const { reporteId } = modalRevision;
    setModalRevision(null);
    await ejecutarCambioEstado(reporteId, "REVISADO", nota);
  };

  const confirmarSancion = async () => {
    const { reporteId } = modalSancion;
    setModalSancion(null);
    await ejecutarCambioEstado(reporteId, "SANCIONADO");
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Panel de administración</h1>
          <p className="text-gray-500 mt-2">Gestiona los usuarios y los reportes de la plataforma.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <TablaUsuarios
          usuarios={usuarios}
          cargando={cargando}
          sesionId={sesion?.id}
          cambiando={cambiando}
          cambiandoActivo={cambiandoActivo}
          onCambiarRol={handleRol}
          onSolicitarCambioActivo={(u) =>
            setModalDesactivar({ userId: u.id, username: u.username, activo: u.activo })
          }
        />

        <ListaReportes
          reportes={reportes}
          cambiandoReporte={cambiandoReporte}
          abrirCambioEstado={abrirCambioEstado}
        />

      </section>

      {modalDesactivar && (
        <ModalDesactivar
          datos={modalDesactivar}
          onConfirmar={confirmarDesactivar}
          onCancelar={() => setModalDesactivar(null)}
        />
      )}

      {modalRevision && (
        <ModalRevision
          onConfirmar={confirmarRevision}
          onCancelar={() => setModalRevision(null)}
        />
      )}

      {modalSancion && (
        <ModalSancion
          onConfirmar={confirmarSancion}
          onCancelar={() => setModalSancion(null)}
        />
      )}
    </div>
  );
};

export default PanelAdmin;
