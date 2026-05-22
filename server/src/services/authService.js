import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/userRepository.js";
import profileRepository from "../repositories/profileRepository.js";
import subscriptionRepository from "../repositories/subscriptionRepository.js";

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "14d" },
  );

const usuarioPublico = (usuario) => ({
  id: usuario.id,
  username: usuario.username,
  email: usuario.email,
  rol: usuario.rol,
});

const registrar = async (datos) => {
  if (await userRepository.buscarPorEmail(datos.email)) {
    throw new ApiError(400, "El email ya está registrado");
  }
  if (await userRepository.buscarPorUsername(datos.username)) {
    throw new ApiError(400, "El nombre de usuario ya está en uso");
  }

  const transaccion = await sequelize.transaction();
  try {
    const nuevoUsuario = await userRepository.crear(
      {
        username: datos.username,
        email: datos.email,
        password: datos.password,
      },
      transaccion,
    );

    await profileRepository.crear(
      {
        id: nuevoUsuario.id,
        nombre: datos.nombre,
        fecha_nacimiento: datos.fecha_nacimiento,
        genero: datos.genero,
        preferencia_genero: datos.preferencia_genero,
      },
      transaccion,
    );

    await subscriptionRepository.crearParaUsuario(nuevoUsuario.id, transaccion);
    await transaccion.commit();

    return {
      token: generarToken(nuevoUsuario),
      usuario: usuarioPublico(nuevoUsuario),
    };
  } catch (err) {
    await transaccion.rollback();
    throw err;
  }
};

const login = async (email, password) => {
  const usuario = await userRepository.buscarPorEmail(email);
  if (!usuario) {
    throw new ApiError(401, "Credenciales incorrectas");
  }
  if (!usuario.activo) {
    throw new ApiError(403, "Esta cuenta ha sido desactivada");
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password);
  if (!passwordCorrecta) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  return {
    token: generarToken(usuario),
    usuario: usuarioPublico(usuario),
  };
};

export default { registrar, login };
