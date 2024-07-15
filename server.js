/* --  Importa los módulos dotenv, express, cors y cookie-session  -- */
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');

const db = require("./app/models"); 

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const billingRoutes = require("./app/routes/billing.routes");
const addressRoutes = require("./app/routes/address.routes");
const productRoutes = require("./app/routes/product.routes");
const gameRoutes = require("./app/routes/game.routes");
const helpCenterRoutes = require("./app/routes/helpCenter.routes");
const bannerAddRoutes = require("./app/routes/bannerAdd.routes");   

dotenv.config();


/* --  Crea una instancia de la aplicación Express  -- */
const app = express();

/* --  Se usa el middleware "cors" en la aplicación -- */
app.use(cors());

/* -- Parsea las solicitudes con el tipo de contenido - application/x-www-form-urlencoded -- */
app.use(express.urlencoded({ extended: true }));

/* -- Configuración del webhook de Stripe antes de express.json() -- */
app.post('/api/v1/billing/webhook', express.raw({ type: 'application/json' }), require('./app/controllers/billing.controller').webhook);

/* -- Parsea las solicitudes con el tipo de contenido - application/json -- */
app.use(express.json());


/* -- Se configura el middleware "cookie-session" en la aplicación -- */
app.use(
    cookieSession({
        name: "casino-session",   
        keys: [process.env.COOKIE_SECRET],  
        httpOnly: true,           
        sameSite: 'strict'        
    })
);


/* -- Sincronizacion de Base de datos -- */
db.sequelize.sync();                    


/* -- Ruta simple -- */
app.get('/', (req, res) => {
    res.send({ message: "Welcome to the casino api" });
});

/* -- Rutas -- */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/help-center', helpCenterRoutes);
app.use('/api/v1/banner-add', bannerAddRoutes);


/* -- Se configura el puerto y escucha las solicitudes entrantes -- */
const startServer = async () => {
    try {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();
