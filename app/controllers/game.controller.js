const db = require("../models");
const Game = db.game;
const GameType = db.gameType;


/* -- Controlador para obtener datos de un tipo de juego -- */
const getGameType = async (req, res) => {
    try {
        const gameType = await GameType.findByPk(req.params.id);
        if (!gameType) {
            return res.status(404).json({ message: "GameType not found" });
        }

        res.status(200).send(gameType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para obtener la lista de tipos de juego -- */
const getGameTypes = async (req, res) => {
    try {
        const gameTypes = await GameType.findAll();
        res.status(200).send(gameTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para obtener datos de un juego -- */
const getGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).send(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para obtener la lista de juegos -- */
const getGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.status(200).send(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para obtener juegos por tipo -- */
const getGamesByType = async (req, res) => {
    try {
        const { id } = req.params || req.body;
        const games = await Game.findAll({ where: { gameTypeID: id } });
        res.status(200).send(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para crear un tipo de juego -- */
const createGameType = async (req, res) => {
    try {
        const { name, shortDescription, longDescription } = req.body;
        if (!name || !shortDescription || !longDescription) {
            return res.status(400).json({ message: "Todos los campos son requeridos"});
        }

        const gameType = await GameType.create({ name, shortDescription, longDescription });
        res.status(201).send(gameType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para crear un juego -- */
const createGame = async (req, res) => {
    try {
        const { name, shortDescription, longDescription, gameTypeID } = req.body;
        if (!name || !shortDescription || !longDescription || !gameTypeID) {
            return res.status(400).json({ message: "Todos los campos son requeridos"});
        }

        const game = await Game.create({ name, shortDescription, longDescription, gameTypeID });
        res.status(201).send(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para editar un tipo de juego -- */
const updateGameType = async (req, res) => {
    try {
        const { id } = req.params|| req.body;
        const fieldsToUpdate = filterValidFields(req.body);

        const gameType = await GameType.findByPk(id);
        if (!gameType) {
            return res.status(404).json({ message: "GameType not found" });
        }

        const [updated] = await Address.update(fieldsToUpdate, { where: { id }});

        if (updated) {
            return res.status(200).send({ message: "GameType actualizado correctamente"});
        } else {
            return res.status(400).send({ message: "GameType no pudo ser actualizado"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


/* -- Controlador para editar datos de un juego -- */
const updateGame = async (req, res) => {
    try {
        const { id } = req.params|| req.body;
        const fieldsToUpdate = filterValidFields(req.body);

        const game = await Game.findByPk(id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const [updated] = await Address.update(fieldsToUpdate, { where: { id }});

        if (updated) {
            return res.status(200).send({ message: "Game actualizado correctamente"});
        } else {
            return res.status(400).send({ message: "Game no pudo ser actualizado"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


/* -- Controlador para eliminar un tipo de juego -- */
const deleteGameType = async (req, res) => {
    try {
        const gameType = await GameType.findByPk(req.params.id);
        if (!gameType) {
            return res.status(404).json({ message: "GameType not found" });
        }
        await gameType.destroy();
        res.json({ message: "GameType deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* -- Controlador para eliminar un juego -- */
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        await game.destroy();
        res.json({ message: "Game deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Utilidad para filtrar campos válidos
const filterValidFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
};


module.exports = {
    getGameType,
    getGameTypes,
    getGame,
    getGames,
    getGamesByType,
    createGameType,
    createGame,
    updateGameType,
    updateGame,
    deleteGameType,
    deleteGame
};