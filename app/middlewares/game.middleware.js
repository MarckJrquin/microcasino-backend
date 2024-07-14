const db = require('../models');
const User = db.user;
const Game = db.game;
const GameType = db.gameType;

const verifyGameExists = async (req, res, next) => {
    try {
        const gameId = req.params.id || req.body.id;

        if (!gameId) {
            return res.status(400).send({ message: "Falta el ID del juego" });
        }

        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).send({ message: "Juego no encontrado" });
        }

        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar juego!" });
    }
}

const verifyGameTypeExists = async (req, res, next) => {
    try {
        const gameTypeId = req.params.id || req.body.id;

        if (!gameTypeId) {
            return res.status(400).send({ message: "Falta el ID del tipo de juego" });
        }

        const gameType = await GameType.findByPk(gameTypeId);

        if (!gameType) {
            return res.status(404).send({ message: "Tipo de juego no encontrado" });
        }

        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar tipo de juego!" });
    }
}


const gameMiddleware = {
    verifyGameExists,
    verifyGameTypeExists
};


module.exports = gameMiddleware;