import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.estado).json({ mensaje: err.message });
  }

  console.error("[Error no controlado]", err);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
};

export default errorHandler;
