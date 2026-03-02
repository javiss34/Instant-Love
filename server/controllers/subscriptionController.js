// Controlador de suscripciones

// Obtener suscripción activa del usuario
export const getActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar la última suscripción activa del usuario
    // TODO: Verificar que fecha_fin > fecha actual
    
    res.json({
      // suscripcion
    });
  } catch (error) {
    console.error('Error en getActiveSubscription:', error);
    res.status(500).json({ error: 'Error al obtener suscripción' });
  }
};

// Obtener historial de suscripciones
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Buscar todas las suscripciones del usuario
    
    res.json({
      // historial: []
    });
  } catch (error) {
    console.error('Error en getSubscriptionHistory:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Crear nueva suscripción
export const createSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, precio_pagado } = req.body;
    
    // TODO: Validar datos
    // TODO: Calcular fecha_fin según el tipo
    // TODO: Procesar pago (integración con pasarela de pago)
    // TODO: Crear suscripción en la BD
    
    res.status(201).json({
      mensaje: 'Suscripción creada',
      // suscripcion
    });
  } catch (error) {
    console.error('Error en createSubscription:', error);
    res.status(500).json({ error: 'Error al crear suscripción' });
  }
};

// Cancelar suscripción
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.params;
    
    // TODO: Verificar que la suscripción pertenece al usuario
    // TODO: Cancelar renovación automática
    // TODO: La suscripción sigue activa hasta fecha_fin
    
    res.json({
      mensaje: 'Suscripción cancelada',
    });
  } catch (error) {
    console.error('Error en cancelSubscription:', error);
    res.status(500).json({ error: 'Error al cancelar suscripción' });
  }
};

// Verificar si el usuario tiene suscripción premium activa
export const checkPremiumStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: Verificar suscripción activa y tipo
    
    res.json({
      // esPremium: true/false,
      // tipo: 'basico'/'premium'
    });
  } catch (error) {
    console.error('Error en checkPremiumStatus:', error);
    res.status(500).json({ error: 'Error al verificar estado premium' });
  }
};
