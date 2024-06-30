const db = require("../models");
const User = db.user;

/*-- Middleware para verificar si el nombre de usuario a recuperar contraseña está registrado en la base de datos --*/
const checkUsername = async (req, res, next) =>{
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if(!user) {
            return res.status(400).send({ message: "Este nombre de usuario no existe." });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};


module.exports = {
    checkUsername
};