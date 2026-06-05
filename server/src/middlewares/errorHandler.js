import ApiError from "../utils/ApiError.js";

//Middleware global que captura todos los errores lanzados en los controladores
//Si es un ApiError lo enviamos con su código y mensaje, si no devolvemos un 500 genérico
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.estado).json({ mensaje: err.message });
  }

  console.error("[Error no controlado]", err);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
};

export default errorHandler;
