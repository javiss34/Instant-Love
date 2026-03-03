import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Profile } from "./Profile.js";
import { Subscription } from "./Subscription.js";
import { CallHistory } from "./CallHistory.js";
import { Outcome } from "./Outcome.js";
import { Report } from "./Report.js";

// 1. USER <-> PROFILE (1:1)
User.hasOne(Profile, {
  foreignKey: { name: "id", allowNull: false },
  onDelete: "CASCADE",
});
Profile.belongsTo(User, { foreignKey: "id" });

// 2. USER <-> SUBSCRIPTION (1:1)
User.hasOne(Subscription, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
Subscription.belongsTo(User, { foreignKey: "userId" });

// 3. USER <-> CALLHISTORY (N:M Reflexiva)
User.hasMany(CallHistory, {
  foreignKey: { name: "user1Id", allowNull: false },
  as: "Llamadas_realizadas",
});
User.hasMany(CallHistory, {
  foreignKey: { name: "user2Id", allowNull: false },
  as: "Llamadas_recibidas",
});

CallHistory.belongsTo(User, { foreignKey: "user1Id", as: "Emisor" });
CallHistory.belongsTo(User, { foreignKey: "user2Id", as: "Receptor" });

// 4. CALLHISTORY <-> OUTCOME (1:1)
CallHistory.hasOne(Outcome, {
  foreignKey: { name: "callId", allowNull: false },
  onDelete: "CASCADE",
});
Outcome.belongsTo(CallHistory, { foreignKey: "callId" });

// 5. USER <-> REPORT (1:N Reflexiva)
User.hasMany(Report, {
  foreignKey: { name: "reporteroId", allowNull: false },
  as: "ReportesRealizados",
});
User.hasMany(Report, {
  foreignKey: { name: "acusadoId", allowNull: false },
  as: "QuejasRecibidas",
});

Report.belongsTo(User, { foreignKey: "reporteroId", as: "Autor" });
Report.belongsTo(User, { foreignKey: "acusadoId", as: "Destino" });

// ==========================================
// 6. CALLHISTORY <-> REPORT (1:N)
// Aquí NO ponemos allowNull: false, porque un reporte
// podría hacerse desde el perfil sin haber habido llamada
// ==========================================
CallHistory.hasMany(Report, {
  foreignKey: "callId",
  onDelete: "SET NULL",
});
Report.belongsTo(CallHistory, { foreignKey: "callId" });

export { sequelize, User, Profile, Subscription, CallHistory, Outcome, Report };
