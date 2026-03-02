// Controlador de usuarios

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Del middleware de autenticación
    
    // TODO: Buscar usuario en la BD
    // TODO: No enviar password en la respuesta
    
    res.json({
      // usuario
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Obtener perfil de otro usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Buscar usuario en la BD
    // TODO: No enviar información sensible (password, email completo, etc.)
    
    res.json({
      // usuario
    });
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, edad, genero, preferencia } = req.body;
    
    // TODO: Validar datos
    // TODO: Actualizar usuario en la BD
    // TODO: No permitir actualizar email o password aquí
    
    res.json({
      mensaje: 'Perfil actualizado',
      // usuario
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passwordActual, passwordNueva } = req.body;
    
    // TODO: Verificar password actual
    // TODO: Hashear nueva password
    // TODO: Actualizar en la BD
    
    res.json({ mensaje: 'Contraseña actualizada' });
  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

// Eliminar cuenta (soft delete)
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Soft delete del usuario (paranoid: true)
    // TODO: Considerar qué hacer con sus datos relacionados
    
    res.json({ mensaje: 'Cuenta eliminada' });
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};

// Obtener usuarios candidatos para votar
export const getCandidates = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPreferencia = req.user.preferencia;
    
    // TODO: Obtener usuarios que coincidan con las preferencias
    // TODO: Excluir usuarios ya votados
    // TODO: Excluir usuarios bloqueados/reportados
    // TODO: Aplicar filtros de edad, etc.
    
    res.json({
      // candidatos: []
    });
  } catch (error) {
    console.error('Error en getCandidates:', error);
    res.status(500).json({ error: 'Error al obtener candidatos' });
  }
};
