const express = require('express');
const addressRouter = express.Router({});

const { authJwt, addressMiddleware } = require("../middlewares");
const addressController = require("../controllers/address.controller");


addressRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


addressRouter.get(
    '/:userId/:id', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists,
        addressMiddleware.verifyAddressExists
    ],  
    addressController.getUserAddress
);


addressRouter.get(
    '/:userId/all', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists
    ],  
    addressController.getUserAddresses
);


addressRouter.post(
    '/:userId/create', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists
    ],  
    addressController.createUserAddress
);


addressRouter.put(
    '/favorite/:userId/:id', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists,
        addressMiddleware.verifyAddressExists
    ],  
    addressController.setFavoriteAddress
);


addressRouter.put(
    '/:userId/:id', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists,
        addressMiddleware.verifyAddressExists
    ],  
    addressController.updateUserAddress
);


addressRouter.delete(
    '/:userId/:id', 
    [
        authJwt.verifyToken,
        addressMiddleware.verifyUserExists,
        addressMiddleware.verifyAddressExists
    ],  
    addressController.deleteUserAddress
);


module.exports = addressRouter;