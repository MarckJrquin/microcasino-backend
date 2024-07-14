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
db.userCredit = require("./userCredit.model.js")(sequelize, Sequelize); 
db.creditTransaction = require("./creditTransaction.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.game = require("./game.model.js")(sequelize, Sequelize);
db.gameType = require("./gameType.model.js")(sequelize, Sequelize);
db.helpCenter = require("./helpCenter.model.js")(sequelize, Sequelize);
db.BannerAdd = require("./bannerAdd.model.js")(sequelize, Sequelize);


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


/* -- Establece la relación uno a muchos entre usuario y direcciones -- */
db.user.hasMany(db.address, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.address.belongsTo(db.user, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});


/* -- Establece la relación uno a muchos entre usuario y cuentas bancarias -- */
db.user.hasMany(db.bankAccount, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.user, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
});


/* -- Establece la relación entre cuenta bancaria y tipo de cuenta -- */
db.bankAccountType.hasMany(db.bankAccount, {
    foreignKey: 'accountTypeID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.bankAccountType, {
    foreignKey: 'accountTypeID',
    onDelete: 'CASCADE'
});


/* -- Establece la relación entre cuenta bancaria y nombre de banco -- */
db.bank.hasMany(db.bankAccount, {
    foreignKey: 'bankNameID',
    onDelete: 'CASCADE'
});
db.bankAccount.belongsTo(db.bank, {
    foreignKey: 'bankNameID',
    onDelete: 'CASCADE'
});


/* -- Establece la relación uno a uno entre usuario y crédito de usuario -- */
db.user.hasOne(db.userCredit, { 
    foreignKey: 'userID', 
    onDelete: 'CASCADE' 
});
db.userCredit.belongsTo(db.user, { 
    foreignKey: 'userID', 
    onDelete: 'CASCADE' 
});


/* -- Establece la relación uno a muchos entre crédito de usuario y transacciones de crédito -- */
db.user.hasMany(db.creditTransaction, { 
    foreignKey: 'userID', 
    onDelete: 'CASCADE' 
});
db.creditTransaction.belongsTo(db.user, { 
    foreignKey: 'userID', 
    onDelete: 'CASCADE' 
});


/* -- Establece la relación uno a muchos entre productos y transacciones de crédito -- */
db.product.hasMany(db.creditTransaction, { 
    foreignKey: 'productID', 
    onDelete: 'CASCADE' 
});
db.creditTransaction.belongsTo(db.product, { 
    foreignKey: 'productID', 
    onDelete: 'CASCADE' 
});


/* -- Establece la relación entre un juego y tipo de juego -- */
db.gameType.hasMany(db.game, {
    foreignKey: 'gameTypeID',
    onDelete: 'CASCADE'
});
db.game.belongsTo(db.gameType, {
    foreignKey: 'gameTypeID',
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

        const productCount = await db.product.count();
        if (productCount === 0) {
            await db.product.bulkCreate([
                { name: '40 Créditos', price: 10.00, credits: 40, picture: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2118/faeeed784e30344d710546e83e147aebcf764796ebff910f.jpg?w=5000&thumb=false' },
                { name: '100 Créditos', price: 20.00, credits: 100, picture: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2118/faeeed784e30344d710546e83e147aebcf764796ebff910f.jpg?w=5000&thumb=false'},
                { name: '170 Créditos', price: 30.00, credits: 170, picture: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2118/a65de1df047ac5e85b948ed2298e78e04ba16f6cb23e3714.jpg?w=5000&thumb=false'},
                { name: '250 Créditos', price: 40.00, credits: 250, picture: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2118/ac1f3a90a8314513d548df54dd9606cefd31645b5f9ee29a.jpg?w=5000&thumb=false'},
                { name: '340 Créditos', price: 50.00, credits: 340, picture: 'https://store-images.s-microsoft.com/image/apps.11742.14521269261070295.01bc443b-3a57-4c8f-b831-e2262b0ad319.9c6e344e-e86a-4359-a265-ed026382a0da?q=90&w=3000&h=2000'},
                { name: '700 Créditos', price: 100.00, credits: 700, picture: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2121/15d7ba14bc94c683c6590c1f3d68ad3399bab4e1395e18e6.jpg?w=5000&thumb=false'},
            ]);
        }

        const gameTypeCount = await db.gameType.count();
        if (gameTypeCount === 0) {
            await db.gameType.bulkCreate([
                { 
                    name: 'Ruleta', 
                    shortDescription: 'Juego de ruleta', 
                    longDescription: 'Juego de ruleta clásico', 
                    url: '/games/ruleta',
                    picture: 'https://images.pexels.com/photos/7594188/pexels-photo-7594188.jpeg', 
                    icon: 'ruleta-icon.png' 
                },
                { 
                    name: 'Blackjack', 
                    shortDescription: 'Juego de blackjack', 
                    longDescription: 'Juego de blackjack clásico', 
                    url: '/games/blackjack',
                    picture: 'https://www.megazap.fr/photo/art/grande/50982495-39229585.jpg?v=1603894442', 
                    icon: 'blackjack-icon.png' 
                },
                { 
                    name: 'Tragamonedas', 
                    shortDescription: 'Juego de tragamonedas',
                    longDescription: 'Juego de tragamonedas clásico', 
                    url: '/games/slots',
                    picture: 'https://slotfree.org/wp-content/uploads/2023/05/Loosest-Slots-123RF-1024x683.jpg', 
                    icon: 'tragamonedas-icon.png' 
                },
                { 
                    name: 'Baccarat', 
                    shortDescription: 'Juego de baccarat', 
                    longDescription: 'Juego de baccarat clásico', 
                    url: '/games/baccarat',
                    picture: 'https://www.theoceanac.com/sites/default/files/styles/room_slideshow_slide/public/2022-03/no-commission-baccarat-ocean-casino-resort.jpg?itok=JQ9iVJ-7', 
                    icon: 'baccarat-icon.png' 
                },
            ]);

            const gameTypes = await db.gameType.findAll();

            const gamesData = [
                { 
                    name: '3 Slots', 
                    shortDescription: 'Tragamonedas de 3 slots', 
                    longDescription: 'Tragamonedas con 3 slots', 
                    url: '/games/slots/3slots', 
                    picture: 'https://www.grandcasinomn.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fmillelacscorp1-mlcv-prod-0352%2Fmedia%2FProject%2FMLCV%2FGrand-Casino%2FMaster-Site%2FPlay%2FHinckley%2FSlots%2FHK-slot-img-1000x800-v1.png%3Fh%3D800%26iar%3D0%26w%3D1000&w=1080&q=75', 
                    icon: '3slots-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Tragamonedas').id 
                },
                { 
                    name: '4 Slots', 
                    shortDescription: 'Tragamonedas de 4 slots', 
                    longDescription: 'Tragamonedas con 4 slots', 
                    url: '/games/slots/4slots', 
                    picture: 'https://betravingknows.com/wp-content/uploads/2019/07/slot-machines-gaming-floor_m.jpg', 
                    icon: '4slots-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Tragamonedas').id 
                },
                { 
                    name: '5 Slots', 
                    shortDescription: 'Tragamonedas de 5 slots', 
                    longDescription: 'Tragamonedas con 5 slots', 
                    url: '/games/slots/5slots', 
                    picture: 'https://www.talkingstickresort.com/media/8337/web-spinsider.png', 
                    icon: '5slots-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Tragamonedas').id 
                },
                { 
                    name: 'Ruleta Europea', 
                    shortDescription: 'Ruleta Europea', 
                    longDescription: 'Ruleta con reglas europeas', 
                    url: '/games/ruleta/ruletaeuropea', 
                    picture: 'https://images.pexels.com/photos/6664246/pexels-photo-6664246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'ruletaeuropea-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Ruleta').id 
                },
                { 
                    name: 'Ruleta Americana', 
                    shortDescription: 'Ruleta Americana', 
                    longDescription: 'Ruleta con reglas americanas', 
                    url: '/games/ruleta/ruletaamericana', 
                    picture: 'https://images.pexels.com/photos/4677402/pexels-photo-4677402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'ruletaamericana-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Ruleta').id 
                },
                { 
                    name: 'Ruleta Francesa', 
                    shortDescription: 'Ruleta Francesa', 
                    longDescription: 'Ruleta con reglas francesas', 
                    url: '/games/ruleta/ruletafrancesa', 
                    picture: 'https://images.pexels.com/photos/7594183/pexels-photo-7594183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'ruletafrancesa-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Ruleta').id 
                },
                { 
                    name: 'Blackjack Clásico', 
                    shortDescription: 'Blackjack Clásico', 
                    longDescription: 'Blackjack con reglas clásicas', 
                    url: '/games/blackjack/blackjackclasico', 
                    picture: 'https://images.pexels.com/photos/3279691/pexels-photo-3279691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'blackjackclasico-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Blackjack').id 
                },
                { 
                    name: 'Blackjack Americano', 
                    shortDescription: 'Blackjack Americano', 
                    longDescription: 'Blackjack con reglas americanas', 
                    url: '/games/blackjack/blackjackamericano', picture: 'https://images.pexels.com/photos/6664196/pexels-photo-6664196.jpeg', 
                    icon: 'blackjackamericano-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Blackjack').id 
                },
                { 
                    name: 'Blackjack Europeo', 
                    shortDescription: 'Blackjack Europeo', 
                    longDescription: 'Blackjack con reglas europeas', 
                    url: '/games/blackjack/blackjackeuropeo', picture: 'https://images.pexels.com/photos/18341169/pexels-photo-18341169/free-photo-of-casino-patatas-fritas-chips-tarjetas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'blackjackeuropeo-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Blackjack').id 
                },
                { 
                    name: 'Baccarat Clásico', 
                    shortDescription: 'Baccarat Clásico', 
                    longDescription: 'Baccarat con reglas clásicas', 
                    url: '/games/baccarat/baccaratclasico', picture: 'https://images.pexels.com/photos/7594250/pexels-photo-7594250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'baccaratclasico-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Baccarat').id 
                },
                { 
                    name: 'Baccarat Americano', 
                    shortDescription: 'Baccarat Americano', 
                    longDescription: 'Baccarat con reglas americanas', 
                    url: '/games/baccarat/baccaratamericano', 
                    picture: 'https://images.pexels.com/photos/7594268/pexels-photo-7594268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'baccaratamericano-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Baccarat').id 
                },
                { 
                    name: 'Baccarat Europeo', 
                    shortDescription: 'Baccarat Europeo', 
                    longDescription: 'Baccarat con reglas europeas', 
                    url: '/games/baccarat/baccarateuropeo', 
                    picture: 'https://images.pexels.com/photos/7594295/pexels-photo-7594295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
                    icon: 'baccarateuropeo-icon.png', 
                    gameTypeID: gameTypes.find(type => type.name === 'Baccarat').id 
                },
            ];

            await db.game.bulkCreate(gamesData);
        }

        const bannerAddCount = await db.BannerAdd.count();
        if (bannerAddCount === 0) {
            await db.BannerAdd.bulkCreate([
                { title: 'Swiper Add 1', description: 'lorem ipsum',  type: 'swiper', imageUrl: 'https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg', iconUrl: '', linkUrl: '/swiper1' },
                { title: 'Swiper Add 2', description: 'lorem ipsum',  type: 'swiper', imageUrl: 'https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg', iconUrl: '', linkUrl: '/swiper2' },
                { title: 'Swiper Add 3', description: 'lorem ipsum',  type: 'swiper', imageUrl: 'https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg', iconUrl: '', linkUrl: '/swiper3' },
                { title: 'Swiper Add 4', description: 'lorem ipsum',  type: 'swiper', imageUrl: 'https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg', iconUrl: '', linkUrl: '/swiper4' },
                { title: 'Swiper Add 5', description: 'lorem ipsum',  type: 'swiper', imageUrl: 'https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg', iconUrl: '', linkUrl: '/swiper5' },
                { title: 'Card Add 1', description: 'lorem ipsum', type: 'card', imageUrl: 'https://pm1.aminoapps.com/6469/58814b3dd292c92c0d1f5967c572eebf61e586a8_00.jpg', iconUrl: '', linkUrl: '/card1' },
                { title: 'Card Add 2', description: 'lorem ipsum', type: 'card', imageUrl: 'https://pm1.aminoapps.com/6469/58814b3dd292c92c0d1f5967c572eebf61e586a8_00.jpg', iconUrl: '', linkUrl: '/card2' },
                { title: 'Card Add 3', description: 'lorem ipsum', type: 'card', imageUrl: 'https://pm1.aminoapps.com/6469/58814b3dd292c92c0d1f5967c572eebf61e586a8_00.jpg', iconUrl: '', linkUrl: '/card3' },
                { title: 'Card Add 4', description: 'lorem ipsum', type: 'card', imageUrl: 'https://pm1.aminoapps.com/6469/58814b3dd292c92c0d1f5967c572eebf61e586a8_00.jpg', iconUrl: '', linkUrl: '/card4' },
                { title: 'Card Add 5', description: 'lorem ipsum', type: 'card', imageUrl: 'https://pm1.aminoapps.com/6469/58814b3dd292c92c0d1f5967c572eebf61e586a8_00.jpg', iconUrl: '', linkUrl: '/card5' },
            ]);
        }


        console.log("Default data has been inserted successfully.");
    } catch (error) {
        console.error("Error synchronizing and seeding database:", error);
    }
}

syncAndSeed();

module.exports = db;
