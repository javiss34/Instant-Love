import authService from "../services/authService.js";

const registrarUsuario = async (req, res) => {
  const resultado = await authService.registrar(req.body);
  res.status(201).json({
    mensaje: "¡Usuario registrado exitosamente!",
    ...resultado,
  });
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  const resultado = await authService.login(email, password);
  res.status(200).json({
    mensaje: "!Login exitoso!",
    ...resultado,
  });
};

export { registrarUsuario, loginUsuario };
