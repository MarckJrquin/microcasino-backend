const config = require("../config/auth.config.js");

const db = require("../models");
const User = db.user;
const Role = db.role;
const Person = db.person;
const Address = db.address;


/* Middleware para verificar si el usuario del parametro existe */
const verifyUserExists = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.body.userId;

        if (!userId) {
            return res.status(400).send({ message: "Falta el ID del usuario" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar usuario!" });
    }
}


/* Middleware para verificar si la direccion del usuario existe */
const verifyAddressExists = async (req, res, next) => {
    try {
        const userID = req.params.userId || req.body.userId;
        const addressId = req.params.id || req.body.id;

        if (!addressId) {
            return res.status(400).send({ message: "Falta el ID de la dirección" });
        }

        const address = await Address.findOne({ where: { id: addressId, userID } });

        if (!address) {
            return res.status(404).send({ message: "Dirección no encontrada" });
        }

        console.log("address", address);
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar dirección!" });
    }
}


const addressMiddleware = {
    verifyUserExists,
    verifyAddressExists
};


module.exports = addressMiddleware;