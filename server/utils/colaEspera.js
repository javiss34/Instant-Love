// Cola en memoria: array de { userId, genero, preferencia_genero }
const cola = [];

// Resultados pendientes de recoger: Map userId → llamadaId
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
  resultados.set(userId, llamadaId);
};

const obtenerResultado = (userId) => {
  return resultados.get(userId) ?? null;
};

const eliminarResultado = (userId) => {
  resultados.delete(userId);
};

export {
  buscarPareja,
  unirseACola,
  sacarDeCola,
  guardarResultado,
  obtenerResultado,
  eliminarResultado,
};
