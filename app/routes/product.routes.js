const express = require('express');
const productRouter = express.Router({});

const { authJwt } = require("../middlewares");
const productController = require("../controllers/product.controller");


productRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


productRouter.get(
    '/get/:id', 
    productController.getProduct
);


productRouter.get(
    '/list', 
    productController.getAllProducts
);


productRouter.post(
    '/create', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],  
    productController.createProduct
);


productRouter.put(
    '/update/:id', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],  
    productController.updateProduct
);


productRouter.delete(
    '/delete/:id', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],  
    productController.deleteProduct
);


module.exports = productRouter;