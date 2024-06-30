const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const db = require("../models");
const User = db.user;


/* -- Middleware para verificar el token de autenticación -- */
const verifyToken = (req, res, next) => {
    const { token } = req.session;

    if (!token) {
        return res.status(403).send({ message: "No token provided!"});
    }

    jwt.verify( 
        token, 
        config.secret, 
        (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }
            req.userId = decoded.id; // Almacena el ID de usuario decodificado en la solicitud
            next();
        }
    );
};


/* -- Middleware para verificar si el usuario es un administrador -- */
const isAdmin = async (req, res, next) => {
    try {
        const { userId } = req;

        console.log({userId});

        const user = await User.findByPk(userId); 
        const roles = await user.getRoles();         

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {    // Si el usuario tiene el rol de administrador, permite el acceso
                return next();
            }
        }

        return res.status(403).send({ message: "Require Admin Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Admin role!" });
    }
};


/* -- Middleware para verificar si el usuario es un moderador -- */
const isModerator = async (req, res, next) => {
    try {
        const { userId } = req;

        const user = await User.findByPk(userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({ message: "Require Moderator Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Moderator role!" });
    }
};


/* -- Middleware para verificar si el usuario es un moderador o Admin-- */
const isModeratorOrAdmin = async (req, res, next) => {
    try {
        const { userId } = req;

        const user = await User.findByPk(userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }

            if (roles[i].name === "admin") {
                return next();
            }
        }

        return res.status(403).send({ message: "Require Moderator or Admin Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Moderator or Admin role!" });
    }
};


const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin
};
  
module.exports = authJwt;