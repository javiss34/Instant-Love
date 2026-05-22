import callService from "../services/callService.js";

const iniciarLlamada = async (req, res) => {
  const llamada = await callService.iniciar(req.usuario.id, req.body.user2Id);
  res.status(201).json({
    mensaje: "Llamada iniciada correctamente",
    llamadaId: llamada.id,
  });
};

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

const unirseAColaBusqueda = async (req, res) => {
  const resultado = await callService.unirseACola(req.usuario.id);
  res.status(200).json(resultado);
};

const comprobarEstadoCola = (req, res) => {
  const resultado = callService.comprobarEstadoCola(req.usuario.id);
  res.status(200).json(resultado);
};

export {
  iniciarLlamada,
  finalizarLlamada,
  unirseAColaBusqueda,
  comprobarEstadoCola,
};
