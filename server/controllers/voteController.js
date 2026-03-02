// Controlador de votos (Match/Next)

// Crear un voto (MATCH o NEXT)
export const createVote = async (req, res) => {
  try {
    const emisorId = req.user.id;
    const { receptorId, decision, callId } = req.body;
    
    // TODO: Validar que decision sea 'MATCH' o 'NEXT'
    // TODO: Verificar que no exista ya un voto de emisor a receptor
    // TODO: Crear el voto en la BD
    // TODO: Si decision es MATCH, verificar si hay voto recíproco
    // TODO: Si hay match mutuo, actualizar campo 'reciproco' a true en ambos votos
    
    res.status(201).json({
      mensaje: 'Voto registrado',
      // esMatch: true/false (si hubo match mutuo)
    });
  } catch (error) {
    console.error('Error en createVote:', error);
    res.status(500).json({ error: 'Error al registrar voto' });
  }
};

// Obtener todos los matches del usuario
export const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar votos donde (emisorId = userId O receptorId = userId) 
    //       Y reciproco = true
    // TODO: Incluir información del otro usuario
    
    res.json({
      // matches: []
    });
  } catch (error) {
    console.error('Error en getMatches:', error);
    res.status(500).json({ error: 'Error al obtener matches' });
  }
};

// Obtener usuarios que te dieron MATCH (pero tú no les has votado aún)
export const getPendingMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar votos donde receptorId = userId, decision = MATCH, reciproco = false
    // TODO: Filtrar solo aquellos donde el usuario no ha votado al emisor
    
    res.json({
      // pendientes: []
    });
  } catch (error) {
    console.error('Error en getPendingMatches:', error);
    res.status(500).json({ error: 'Error al obtener matches pendientes' });
  }
};

// Eliminar un match (unmatch)
export const deleteMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchedUserId } = req.params;
    
    // TODO: Encontrar los votos mutuos entre userId y matchedUserId
    // TODO: Actualizar reciproco a false o eliminar los votos
    // TODO: Considerar qué hacer con mensajes/historial
    
    res.json({
      mensaje: 'Match eliminado',
    });
  } catch (error) {
    console.error('Error en deleteMatch:', error);
    res.status(500).json({ error: 'Error al eliminar match' });
  }
};

// Obtener estadísticas de votos del usuario
export const getVoteStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Contar votos MATCH enviados
    // TODO: Contar votos NEXT enviados
    // TODO: Contar matches recíprocos
    // TODO: Calcular tasa de match
    
    res.json({
      // stats: {
      //   matchesEnviados: 0,
      //   nextsEnviados: 0,
      //   matchesRecibidos: 0,
      //   matchesMutuos: 0,
      //   tasaMatch: 0
      // }
    });
  } catch (error) {
    console.error('Error en getVoteStats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
