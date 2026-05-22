class ApiError extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
    this.name = "ApiError";
  }
}

export default ApiError;
