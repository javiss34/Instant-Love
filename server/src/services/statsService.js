import callHistoryRepository from "../repositories/callHistoryRepository.js";
import outcomeRepository from "../repositories/outcomeRepository.js";
import profileRepository from "../repositories/profileRepository.js";
import reportRepository from "../repositories/reportRepository.js";

const obtenerEstadisticas = async (userId, rol) => {
  //Pedimos las citas/minutos y los ids de matches en paralelo para no esperar uno tras otro
  const [{ citas, minutos }, otrosIds] = await Promise.all([
    callHistoryRepository.estadisticasPorUsuario(userId),
    outcomeRepository.listarMatchesPorUsuario(userId),
  ]);

  //Contamos cuántas veces aparece cada id para detectar matches repetidos con la misma persona
  const conteoIds = otrosIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  //Solo buscamos el perfil una vez por persona, aunque hayan hecho match varias veces
  const idsUnicos = Object.keys(conteoIds);
  const perfiles = await Promise.all(
    idsUnicos.map((id) => profileRepository.buscarPorId(id)),
  );

  const matches = perfiles.map((p, i) => ({
    nombre: p?.nombre ?? null,
    foto: p?.foto ?? null,
    red_social_tipo: p?.red_social_tipo ?? null,
    red_social_usuario: p?.red_social_usuario ?? null,
    veces: conteoIds[idsUnicos[i]],
  }));

  //Conexiones son los matches que tienen perfil visible (nombre y foto)
  //Usamos la misma lógica que el filtro del frontend para que el número cuadre
  const conexiones = matches.filter((m) => m.nombre && m.foto).length;

  const resultado = { citas, minutos, conexiones, matches };

  //Los reportes recientes solo se incluyen si el usuario es administrador
  if (rol === "ADMIN") {
    resultado.reportes = await reportRepository.listarRecientes(10);
  }

  return resultado;
};

export default { obtenerEstadisticas };
