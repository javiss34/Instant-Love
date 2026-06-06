// Cola en memoria: array de { userId, genero, preferencia_genero }
const cola = [];

// Resultados pendientes de recoger: Map userId → { llamadaId, creadoEn }
// Si el usuario no recoge su resultado en este tiempo, se descarta para no acumular entradas huérfanas
const TIEMPO_EXPIRACION_MS = 5 * 60 * 1000;
const resultados = new Map();

// Devuelve true si la preferencia de A es compatible con el género de B
const esCompatible = (preferencia, genero) => {
  if (preferencia === "AMBOS") return true;
  return preferencia === genero;
};

// Busca el primer usuario en cola compatible con nuevoUsuario (mutuo)
const buscarPareja = (nuevoUsuario) => {
  return (
    cola.find(
      (otro) =>
        otro.userId !== nuevoUsuario.userId &&
        esCompatible(nuevoUsuario.preferencia_genero, otro.genero) &&
        esCompatible(otro.preferencia_genero, nuevoUsuario.genero)
    ) ?? null
  );
};

// Añade un usuario a la cola (ignora si ya estaba)
const unirseACola = (usuario) => {
  if (cola.some((u) => u.userId === usuario.userId)) return;
  cola.push(usuario);
};

// Elimina un usuario de la cola por su id
const sacarDeCola = (userId) => {
  const indice = cola.findIndex((u) => u.userId === userId);
  if (indice !== -1) cola.splice(indice, 1);
};

const guardarResultado = (userId, llamadaId) => {
  resultados.set(userId, { llamadaId, creadoEn: Date.now() });
};

const obtenerResultado = (userId) => {
  const entrada = resultados.get(userId);
  if (!entrada) return null;
  //Si el usuario no recogió su resultado a tiempo, lo descartamos
  if (Date.now() - entrada.creadoEn > TIEMPO_EXPIRACION_MS) {
    resultados.delete(userId);
    return null;
  }
  return entrada.llamadaId;
};

const eliminarResultado = (userId) => {
  resultados.delete(userId);
};

const obtenerCola = () => cola.map(u => `id:${u.userId} g:${u.genero} p:${u.preferencia_genero}`);

export {
  buscarPareja,
  unirseACola,
  sacarDeCola,
  guardarResultado,
  obtenerResultado,
  eliminarResultado,
  obtenerCola,
};
