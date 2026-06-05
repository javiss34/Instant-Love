import authService from "../services/authService.js";

//Crea el usuario junto con su perfil y devuelve ya el token para que no tenga que hacer login aparte
const registrarUsuario = async (req, res) => {
  const resultado = await authService.registrar(req.body);
  res.status(201).json({
    mensaje: "¡Usuario registrado exitosamente!",
    ...resultado,
  });
};

//Comprueba email y contraseña y devuelve el token si todo está bien
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  const resultado = await authService.login(email, password);
  res.status(200).json({
    mensaje: "!Login exitoso!",
    ...resultado,
  });
};

//Usa el id del token para que nadie pueda eliminar la cuenta de otro
const eliminarCuenta = async (req, res) => {
  await authService.eliminarCuenta(req.usuario.id);
  res.status(200).json({ mensaje: "Cuenta eliminada correctamente" });
};

export { registrarUsuario, loginUsuario, eliminarCuenta };
