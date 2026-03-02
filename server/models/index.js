import { User } from "./User.js";
import { Profile } from "./Profile.js";
import { Subscription } from "./Subscription.js";
import { CallHistory } from "./CallHistory.js"

/* 1:1 USER <-> PROFILE */
User.hasOne(Profile, {
  foreignKey: {
    name: "id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "id",
});

/* 1:1 USER <-> SUBSCRIPTION */
User.hasOne(Subscription, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

Subscription.belongsTo(User, {
  foreignKey: "userId",
});

/* N:M USER <-> CALLHISTORY */
//relación para el usuario 1
User.hasMany(CallHistory, {
    foreignKey: 'user1Id',
    as: 'Llamadas_realizadas'
});

CallHistory.belongsTo(User, {
    foreignKey: 'user1Id',
    as: 'Emisor'
});

//relación para el usuario 2
User.hasMany(CallHistory, {
    foreignKey: 'user2Id',
    as: 'Llamadas_recibidas'
})

CallHistory.belongsTo(User,{
    foreignKey: 'user2Id',
    as: 'Receptor'
})

export { User, Profile };
