import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Profile } from "./Profile.js";
import { Subscription } from "./Subscription.js";
import { CallHistory } from "./CallHistory.js";
import { Outcome } from "./Outcome.js";
import { Report } from "./Report.js";

// 1. USER <-> PROFILE (1:1)
//Si el usuario se borra, se borra su perfil.
User.hasOne(Profile, {
  foreignKey: { name: "id", allowNull: false },
  onDelete: "CASCADE",
});
Profile.belongsTo(User, { foreignKey: "id" });

// 2. USER <-> SUBSCRIPTION (1:1)
//Si se borra el usuario se borra la suscripción.
User.hasOne(Subscription, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
Subscription.belongsTo(User, { foreignKey: "userId" });

// 3. USER <-> CALLHISTORY (1:N DOBLE)
//Como en una llamada participan dos usuarios, creamos dos relaciones
//diferentes apuntando a la misma tabla (CallHistory)
User.hasMany(CallHistory, {
  foreignKey: { name: "user1Id", allowNull: true },
  as: "Llamadas_realizadas",
  onDelete: "SET NULL",//Si el usuario se borra la llamada se mantiene en el historial, pero este campo se queda en null.
});
User.hasMany(CallHistory, {
  foreignKey: { name: "user2Id", allowNull: true },
  as: "Llamadas_recibidas",
  onDelete: "SET NULL",
});

//Relación inversa: Desde la llamada se puede consultar quien es el Emisor(user1) y el receptor(user2)
CallHistory.belongsTo(User, { foreignKey: "user1Id", as: "Emisor" });
CallHistory.belongsTo(User, { foreignKey: "user2Id", as: "Receptor" });

// 4. CALLHISTORY <-> OUTCOME (1:1)
//Cada videollamada genera un único resultado, que es el voto mutuo al finalizar
//Si se borra el historial de una llamada, los votos asociados tambien se borran.
CallHistory.hasOne(Outcome, {
  foreignKey: { name: "callId", allowNull: false },
  onDelete: "CASCADE",
});
Outcome.belongsTo(CallHistory, { foreignKey: "callId" });

// 5. USER <-> REPORT (1:N DOBLE)
//Los reportes involucran a dos usuarios
//Un usuario puede hacer varios reportes y recibir varios.
User.hasMany(Report, {
  foreignKey: { name: "reporteroId", allowNull: true },
  as: "ReportesRealizados",
  onDelete: "SET NULL",//Aunque el usuario se borre se queda el reporte.
});
User.hasMany(Report, {
  foreignKey: { name: "acusadoId", allowNull: true },
  as: "QuejasRecibidas",
  onDelete: "SET NULL",
});

//Relación inversa: Desde un reporte podemos saber quien es el autor y el destino.
Report.belongsTo(User, { foreignKey: "reporteroId", as: "Autor" });
Report.belongsTo(User, { foreignKey: "acusadoId", as: "Destino" });

// 6. CALLHISTORY <-> REPORT (1:N)
//En una videollamada pueden haber varios reportes, ya sea porque se denuncian entre ambos
//O porque se denuncia al mismo usuario varias veces
CallHistory.hasMany(Report, {
  foreignKey: "callId",
  onDelete: "SET NULL",
});
Report.belongsTo(CallHistory, { foreignKey: "callId" });

export { sequelize, User, Profile, Subscription, CallHistory, Outcome, Report };
