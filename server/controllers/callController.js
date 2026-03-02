// Controlador de videollamadas

// Iniciar nueva videollamada
export const startCall = async (req, res) => {
  try {
    const user1Id = req.user.id;
    const { user2Id } = req.body;
    
    // TODO: Verificar que ambos usuarios existen
    // TODO: Verificar que hay match entre los usuarios
    // TODO: Generar roomUrl única
    // TODO: Crear registro en CallHistory
    
    res.status(201).json({
      mensaje: 'Videollamada iniciada',
      // roomUrl,
      // callId
    });
  } catch (error) {
    console.error('Error en startCall:', error);
    res.status(500).json({ error: 'Error al iniciar videollamada' });
  }
};

// Finalizar videollamada
export const endCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const { duracion } = req.body;
    
    // TODO: Verificar que el usuario es parte de la llamada
    // TODO: Actualizar duración en CallHistory
    
    res.json({
      mensaje: 'Videollamada finalizada',
    });
  } catch (error) {
    console.error('Error en endCall:', error);
    res.status(500).json({ error: 'Error al finalizar videollamada' });
  }
};

// Obtener historial de llamadas del usuario
export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar llamadas donde user1Id o user2Id sea userId
    // TODO: Incluir información básica del otro usuario
    // TODO: Ordenar por fecha (más recientes primero)
    
    res.json({
      // historial: []
    });
  } catch (error) {
    console.error('Error en getCallHistory:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Obtener detalles de una llamada específica
export const getCallById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { callId } = req.params;
    
    // TODO: Buscar la llamada
    // TODO: Verificar que el usuario es parte de la llamada
    
    res.json({
      // call
    });
  } catch (error) {
    console.error('Error en getCallById:', error);
    res.status(500).json({ error: 'Error al obtener llamada' });
  }
};

// Generar token para sala de videollamada
export const generateRoomToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { callId } = req.params;
    
    // TODO: Verificar que el usuario es parte de la llamada
    // TODO: Generar token para servicio de videollamadas (Jitsi, Twilio, etc.)
    
    res.json({
      // token,
      // roomUrl
    });
  } catch (error) {
    console.error('Error en generateRoomToken:', error);
    res.status(500).json({ error: 'Error al generar token' });
  }
};
