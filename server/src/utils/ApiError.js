//Clase para lanzar errores controlados desde cualquier parte del backend
//Guardamos el código HTTP (estado) junto al mensaje para que el errorHandler lo use directamente
class ApiError extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
    this.name = "ApiError";
  }
}

export default ApiError;
