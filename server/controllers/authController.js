// Controlador de autenticación

// Registro de nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, edad, genero, preferencia } = req.body;
    
    // TODO: Validar datos de entrada
    // TODO: Verificar si el email ya existe
    // TODO: Hashear password
    // TODO: Crear usuario en la BD
    
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      // usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Validar datos de entrada
    // TODO: Buscar usuario por email
    // TODO: Verificar password
    // TODO: Generar token JWT
    
    res.json({
      mensaje: 'Login exitoso',
      // token,
      // usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Logout de usuario
export const logout = async (req, res) => {
  try {
    // TODO: Invalidar token (si usas blacklist)
    
    res.json({ mensaje: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

// Verificar token
export const verifyToken = async (req, res) => {
  try {
    // TODO: Verificar que el token es válido
    // req.user ya debería estar disponible si usas middleware de auth
    
    res.json({
      mensaje: 'Token válido',
      // usuario: req.user
    });
  } catch (error) {
    console.error('Error en verifyToken:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};
