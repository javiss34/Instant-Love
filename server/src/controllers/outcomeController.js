import outcomeService from "../services/outcomeService.js";

const registrarVoto = async (req, res) => {
  console.log(`[VOTO] userId=${req.usuario.id} callId=${req.params.callId} voto=${req.body.voto}`);
  const resultado = await outcomeService.registrar(
    req.params.callId,
    req.usuario.id,
    req.body.voto,
  );
  console.log(`[VOTO] resultado: match=${resultado.match}`);
  const mensaje = resultado.match
    ? "¡¡¡HAY INSTANT LOVE!!!"
    : "Voto registrado correctamente";
  res.status(200).json({ mensaje, ...resultado });
};

export { registrarVoto };
