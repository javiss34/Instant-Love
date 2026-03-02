import { User, Profile, Subscription } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sequelize } from "../models/index.js";

const registrarUsuario = async (req, res) => {
  const transaccion = await sequelize.transaction();

  try {
    const {
      email,
      password,
      nombre,
      fecha_nacimiento,
      genero,
      preferencia_genero,
    } = req.body;

    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      await transaccion.rollback();
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const nuevoUsuario = await User.create(
      { email, password },
      { transaction: transaccion },
    );

    await Profile.create(
      {
        id: nuevoUsuario.id,
        nombre,
        fecha_nacimiento,
        genero,
        preferencia_genero,
      },
      { transaction: transaccion },
    );

    await Subscription.create(
      { userId: nuevoUsuario.id },
      { transaction: transaccion },
    );

    await transaccion.commit();

    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET || "clave_secreta_instant_love",
      { expiresIn: "14d" },
    );

    res.status(201).json({
      mensaje: "¡Usuario registrado exitosamente!",
      token: token,
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    await transaccion.rollback();
    console.error("Error en el registro de usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!usuario.activo) {
      return res
        .status(403)
        .json({ message: "Esta cuenta ha sido desactivada" });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || "clave_secreta_instant_love",
      { expiresIn: "14d" },
    );

    res.status(200).json({
      mensaje: "!Login exitoso!",
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en el login de usuario:", error);
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export { registrarUsuario, loginUsuario };
