import callService from "../services/callService.js";

//Registra en la BD que estos dos usuarios han iniciado una llamada juntos
const iniciarLlamada = async (req, res) => {
  const llamada = await callService.iniciar(req.usuario.id, req.body.user2Id);
  res.status(201).json({
    mensaje: "Llamada iniciada correctamente",
    llamadaId: llamada.id,
  });
};

//Guarda la duración y cierra la llamada cuando el usuario sale de la sala
const finalizarLlamada = async (req, res) => {
  const llamada = await callService.finalizar(
    req.params.id,
    req.usuario.id,
    req.body,
  );
  res.status(200).json({
    mensaje: "Llamada finalizada correctamente",
    llamada,
  });
};

//Devuelve los datos de la llamada para que el frontend pueda montar la sala de Daily.co
const obtenerLlamada = async (req, res) => {
  const llamada = await callService.obtenerParticipante(req.params.id, req.usuario.id);
  res.status(200).json(llamada);
};

//El frontend llama a este endpoint para entrar en la cola de emparejamiento
const unirseAColaBusqueda = async (req, res) => {
  const resultado = await callService.unirseACola(req.usuario.id);
  res.status(200).json(resultado);
};

//El frontend hace polling con esto para saber si ya le han encontrado pareja mientras espera
const comprobarEstadoCola = (req, res) => {
  const resultado = callService.comprobarEstadoCola(req.usuario.id);
  res.status(200).json(resultado);
};

export {
  iniciarLlamada,
  finalizarLlamada,
  obtenerLlamada,
  unirseAColaBusqueda,
  comprobarEstadoCola,
};
