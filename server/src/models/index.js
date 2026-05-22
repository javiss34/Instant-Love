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

// 3. USER <-> CALLHISTORY (Dos relaciones 1:N)
User.hasMany(CallHistory, {
  foreignKey: { name: "user1Id", allowNull: true },
  as: "Llamadas_realizadas",
  onDelete: "SET NULL",
});
User.hasMany(CallHistory, {
  foreignKey: { name: "user2Id", allowNull: true },
  as: "Llamadas_recibidas",
  onDelete: "SET NULL",
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
  foreignKey: { name: "reporteroId", allowNull: true },
  as: "ReportesRealizados",
  onDelete: "SET NULL",
});
User.hasMany(Report, {
  foreignKey: { name: "acusadoId", allowNull: true },
  as: "QuejasRecibidas",
  onDelete: "SET NULL",
});

Report.belongsTo(User, { foreignKey: "reporteroId", as: "Autor" });
Report.belongsTo(User, { foreignKey: "acusadoId", as: "Destino" });

// 6. CALLHISTORY <-> REPORT (1:N)
CallHistory.hasMany(Report, {
  foreignKey: "callId",
  onDelete: "SET NULL",
});
Report.belongsTo(CallHistory, { foreignKey: "callId" });

export { sequelize, User, Profile, Subscription, CallHistory, Outcome, Report };
