import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno.");
}

const verificarToken = (req, res, next) => {
  const cabecera = req.headers.authorization;

  if (!cabecera) {
    throw new ApiError(401, "Acceso denegado. Es necesario un token.");
  }

  const token = cabecera.startsWith("Bearer ")
    ? cabecera.slice(7)
    : cabecera;

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    throw new ApiError(401, "Token inválido.");
  }
};

const esAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== "ADMIN") {
    throw new ApiError(403, "Acceso denegado. Se requiere rol de administrador.");
  }
  next();
};

export { verificarToken, esAdmin };
