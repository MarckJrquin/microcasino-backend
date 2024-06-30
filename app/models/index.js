const config = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.DIALECT,
        define: {
            freezeTableName: config.define.freezeTableName
        },
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.person = require("./person.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);
db.bank = require("./bank.model.js")(sequelize, Sequelize);
db.bankAccount = require("./bankAccount.model.js")(sequelize, Sequelize);
db.bankAccountType = require("./bankAccountType.model.js")(sequelize, Sequelize);
db.paymentCard = require("./paymentCard.model.js")(sequelize, Sequelize);


/* -- Establece una relación de muchos a muchos entre los roles y los usuarios -- */
db.role.belongsToMany(db.user, {
    through: "user_roles"
});
db.user.belongsToMany(db.role, {
    through: "user_roles"
});


/* -- Establece la relación uno a uno entre user y persons -- */
db.user.hasOne(db.person, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.person.belongsTo(db.user,{
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});


/* -- Establecer la relación uno a muchos entre usuario y direcciones -- */
db.user.hasMany(db.address, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.address.belongsTo(db.user, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
  

/* -- Establece la relación uno a muchos entre usuario y tarjetas -- */
db.user.hasMany(db.paymentCard, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.paymentCard.belongsTo(db.user, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});


/* -- Establecer la relación uno a muchos entre usuario y cuentas bancarias -- */
db.user.hasMany(db.bankAccount, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.user, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});


/* -- Establecer la relación entre cuenta bancaria y tipo de cuenta -- */
db.bankAccountType.hasMany(db.bankAccount, {
    foreignKey: 'accountTypeID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.bankAccountType, {
    foreignKey: 'accountTypeID',
    onDelete: 'CASCADE'
});


/* -- Establecer la relación entre cuenta bancaria y nombre de banco -- */
db.bank.hasMany(db.bankAccount, {
    foreignKey: 'bankNameID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.bank, {
    foreignKey: 'bankNameID',
    onDelete: 'CASCADE'
});

  
async function syncAndSeed() {
    try {
        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");

        // Insertar datos predefinidos si no existen
        const roleCount = await db.role.count();
        if (roleCount === 0) {
            await db.role.bulkCreate([
                { name: 'user' },
                { name: 'moderator' },
                { name: 'admin' },
            ]);
        }

        const accountTypeCount = await db.bankAccountType.count();
        if (accountTypeCount === 0) {
            await db.bankAccountType.bulkCreate([
                { name: 'Ahorro' },
                { name: 'Corriente' },
                // { name: 'Plazo Fijo' },
                // { name: 'Ahorro Programado' },
                // { name: 'Ahorro Infantil' },
                // { name: 'Ahorro para Educación' },
                // { name: 'Depósito en Garantía' },
                // { name: 'Ahorro en Moneda Extranjera' }
            ]);
        }

        const bankCount = await db.bank.count();
        if (bankCount === 0) {
            await db.bank.bulkCreate([
                { name: 'Allbank Corp' },
                { name: 'BAC International Bank, Inc.' },
                { name: 'Balboa Bank & Trust Corp' },
                { name: 'Banco Aliado S.A.' },
                { name: 'Banco Azteca (Panamá), S.A.' },
                { name: 'Banco BAC de Panamá, S.A.' },
                { name: 'Banco Bolivariano (Panamá), S.A.' },
                { name: 'Banco Citibank (Panamá,) S.A.' },
                { name: 'Banco Davivienda (Panamá) S.A.' },
                { name: 'Banco de Bogotá, S.A.' },
                { name: 'Banco del Pacífico (Panamá), S.A.' },
                { name: 'Banco Delta, S.A.' },
                { name: 'Banco Ficohsa (Panamá), S.A.' },
                { name: 'Banco G&T Continental (Panamá) S.A. (BMF)' },
                { name: 'Banco HIPOTECARIO NACIONAL' },
                { name: 'Banco General, S.A.' },
                { name: 'Banco Internacional de Costa Rica, S.A (BICSA)' },
                { name: 'Banco La Hipotecaria, S.A.' },
                { name: 'Banco Lafise Panamá S.A.' },
                { name: 'Banco Latinoamericano de Comercio Exterior, S.A. (BLADEX)' },
                { name: 'Banco Nacional de Panamá' },
                { name: 'Banco Panamá, S.A' },
                { name: 'Banco Panameño de la Vivienda, S.A. (BANVIVIENDA)' },
                { name: 'Banco Pichincha Panamá, S.A.' },
                { name: 'Banco Prival, S.A. (Español) o Prival Bank, S.A. (en inglés)' },
                { name: 'Banco Universal, S.A.' },
                { name: 'Bancolombia S.A.' },
                { name: 'Banesco S.A.' },
                { name: 'BANISI, S.A.' },
                { name: 'Banistmo S.A.' },
                { name: 'Bank Leumi-Le Israel B.M.' },
                { name: 'Bank of China Limited' },
                { name: 'BBP Bank S.A.' },
                { name: 'BCT Bank International S.A.' },
                { name: 'Caja de Ahorros' },
                { name: 'Capital Bank Inc.' },
                { name: 'Citibank, N.A. Sucursal Panamá' },
                { name: 'Credicorp Bank S.A.' },
                { name: 'FPB Bank Inc.' },
                { name: 'Global Bank Corporation' },
                { name: 'Korea Exchange Bank, Ltd.' },
                { name: 'Mega International Commercial Bank Co. Ltd.' },
                { name: 'Mercantil Bank (Panamá), S.A.' },
                { name: 'Metrobank, S.A.' },
                { name: 'MiBanco, S.A.BMF' },
                { name: 'MMG Bank Corporation' },
                { name: 'Multibank Inc.' },
                { name: 'Produbank (Panamá) S.A.' },
                { name: 'St. Georges Bank & Company, Inc.' },
                { name: 'The Bank of Nova Scotia (Panamá), S.A.' },
                { name: 'The Bank of Nova Scotia (SCOTIABANK)' },
                { name: 'Towerbank International Inc.' },
                { name: 'Unibank, S.A.' },
            ]);
        }

        console.log("Default data has been inserted successfully.");
    } catch (error) {
        console.error("Error synchronizing and seeding database:", error);
    }
}

syncAndSeed();

module.exports = db;
