const express = require('express');
const gameRouter = express.Router({});

const { authJwt } = require("../middlewares");
const gameController = require("../controllers/game.controller");

gameRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

/* -- Ruta para obtener datos de un tipo de juego -- */
gameRouter.get(
    '/type/:id', 
    gameController.getGameType
);


/* -- Ruta para obtener la lista de tipos de juego -- */
gameRouter.get(
    '/types', 
    gameController.getGameTypes
);


/* -- Ruta para obtener datos de un juego -- */
gameRouter.get(
    '/get/:id', 
    gameController.getGame
);


/* -- Ruta para obtener la lista de juegos -- */
gameRouter.get(
    '/all', 
    gameController.getGames
);


/* -- Ruta para obtener juegos por tipo -- */
gameRouter.get(
    '/type/:id/games', 
    gameController.getGamesByType
);


/* -- Ruta para crear un tipo de juego -- */
gameRouter.post(
    '/type/create', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.createGameType
);


/* -- Ruta para crear un juego -- */
gameRouter.post(
    '/create', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.createGame
);


/* -- Ruta para editar un tipo de juego -- */
gameRouter.put(
    '/type/edit/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.updateGameType
);

/* -- Ruta para editar datos de un juego -- */
gameRouter.put(
    '/edit/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.updateGame
);


/* -- Ruta para eliminar un tipo de juego -- */
gameRouter.delete(
    '/type/delete/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.deleteGameType
);


/* -- Ruta para eliminar un juego -- */
gameRouter.delete(
    '/delete/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    gameController.deleteGame
);


module.exports = gameRouter;