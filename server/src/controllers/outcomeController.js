import outcomeService from "../services/outcomeService.js";

const registrarVoto = async (req, res) => {
  const resultado = await outcomeService.registrar(
    req.params.callId,
    req.usuario.id,
    req.body.voto,
  );
  const mensaje = resultado.match
    ? "¡¡¡HAY INSTANT LOVE!!!"
    : "Voto registrado correctamente";
  res.status(200).json({ mensaje, ...resultado });
};

export { registrarVoto };
