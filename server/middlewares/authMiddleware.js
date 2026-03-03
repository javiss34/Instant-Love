import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "Acceso denegado. Es necesario un token." });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave_secreta_instant_love",
    );

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido." });
  }
};

const esAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ mensaje: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};

export { verificarToken, esAdmin };
