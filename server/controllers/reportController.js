// Controlador de reportes/denuncias

// Crear un reporte
export const createReport = async (req, res) => {
  try {
    const denuncianteId = req.user.id;
    const { denunciadoId, motivo, descripcion } = req.body;
    
    // TODO: Validar datos
    // TODO: Verificar que no se auto-reporte
    // TODO: Crear reporte con estado 'pendiente'
    
    res.status(201).json({
      mensaje: 'Reporte enviado',
      // reporte
    });
  } catch (error) {
    console.error('Error en createReport:', error);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};

// Obtener reportes realizados por el usuario
export const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar reportes donde denuncianteId = userId
    
    res.json({
      // reportes: []
    });
  } catch (error) {
    console.error('Error en getMyReports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

// [ADMIN] Obtener todos los reportes
export const getAllReports = async (req, res) => {
  try {
    // TODO: Verificar que el usuario es admin (req.user.rol)
    // TODO: Obtener todos los reportes
    // TODO: Permitir filtrar por estado
    
    res.json({
      // reportes: []
    });
  } catch (error) {
    console.error('Error en getAllReports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

// [ADMIN] Obtener reportes de un usuario específico
export const getReportsByUser = async (req, res) => {
  try {
    // TODO: Verificar que el usuario es admin
    const { userId } = req.params;
    
    // TODO: Buscar reportes donde denunciadoId = userId
    
    res.json({
      // reportes: []
    });
  } catch (error) {
    console.error('Error en getReportsByUser:', error);
    res.status(500).json({ error: 'Error al obtener reportes del usuario' });
  }
};

// [ADMIN] Actualizar estado de un reporte
export const updateReportStatus = async (req, res) => {
  try {
    // TODO: Verificar que el usuario es admin
    const { reportId } = req.params;
    const { estado } = req.body; // 'pendiente', 'en_revision', 'resuelto', 'rechazado'
    
    // TODO: Actualizar estado del reporte
    // TODO: Si se resuelve, considerar acciones sobre el denunciado
    
    res.json({
      mensaje: 'Estado actualizado',
      // reporte
    });
  } catch (error) {
    console.error('Error en updateReportStatus:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// [ADMIN] Eliminar un reporte
export const deleteReport = async (req, res) => {
  try {
    // TODO: Verificar que el usuario es admin
    const { reportId } = req.params;
    
    // TODO: Eliminar el reporte
    
    res.json({
      mensaje: 'Reporte eliminado',
    });
  } catch (error) {
    console.error('Error en deleteReport:', error);
    res.status(500).json({ error: 'Error al eliminar reporte' });
  }
};
