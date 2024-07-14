const express = require('express');
const bannerAddRouter = express.Router({});

const { authJwt, bannerAddMiddleware } = require("../middlewares");
const bannerAddController = require("../controllers/bannerAdd.controller");

bannerAddRouter.get(
    '/bannerAdd/:id', 
    [authJwt.verifyToken], 
    bannerAddController.getBannerAdd
);

bannerAddRouter.get(
    '/bannerAdd', 
    [authJwt.verifyToken], 
    bannerAddController.getAllBannerAdds
);

bannerAddRouter.get(
    '/bannerAdd/type/:type', 
    [authJwt.verifyToken], 
    bannerAddController.getBannerAddsByType
);

bannerAddRouter.get(
    '/bannerAdd/active', 
    [authJwt.verifyToken], 
    bannerAddController.getActiveBannerAdds
);

bannerAddRouter.get(
    '/bannerAdd/inactive', 
    [authJwt.verifyToken], 
    bannerAddController.getInactiveBannerAdds
);

bannerAddRouter.post(
    '/bannerAdd', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.createBannerAdd
);

bannerAddRouter.put(
    '/bannerAdd/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.updateBannerAdd
);

bannerAddRouter.delete(
    '/bannerAdd/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.deleteBannerAdd
);

module.exports = bannerAddRouter;