const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyForgotPass = require("./verifyForgotPass");
const verifyUserProfile = require("./verifyUserProfile");
const billingMiddleware = require("./billingMiddleware");
const addressMiddleware = require("./addressMiddleware");
const gameMiddleware = require("./game.middleware");
const bannerAddMiddleware = require("./bannerAddMiddleware");
const mediaCheck = require("./mediaCheck");

module.exports = {
    authJwt,              // Middleware de autenticación JWT
    verifySignUp,         // Middleware de verificación de registro
    verifyForgotPass,     // Middleware de verificación de campos de olvido contraseña
    verifyUserProfile,    // Middleware de verificación de cambios de campos en el perfil
    billingMiddleware,    // Middleware de verificación de data en el módulo de facturación
    addressMiddleware,    // Middleware de verificación de data en el módulo de direcciones
    gameMiddleware,       // Middleware de verificación de data en el módulo de juegos
    bannerAddMiddleware,  // Middleware de verificación de data en el módulo de bannerAdd
    mediaCheck            // Middleware de verificación de archivos multimedia
};