const express = require('express');
const helpCenterRouter = express.Router({});

const { authJwt } = require("../middlewares");
const helpCenterController = require("../controllers/helpCenter.controller");

helpCenterRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

helpCenterRouter.post(
    '/request', 
    helpCenterController.createRequest
);

helpCenterRouter.get(
    '/request/:id', 
    helpCenterController.getRequest
);

helpCenterRouter.get(
    '/request', 
    helpCenterController.getRequests
);

helpCenterRouter.put(
    '/request/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    helpCenterController.updateRequest
);

helpCenterRouter.delete(
    '/request/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    helpCenterController.deleteRequest
);

module.exports = helpCenterRouter;