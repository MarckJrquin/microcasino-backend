const express = require('express');
const bannerAddRouter = express.Router({});

const { authJwt, bannerAddMiddleware } = require("../middlewares");
const bannerAddController = require("../controllers/bannerAdd.controller");

bannerAddRouter.get(
    '/get/:id', 
    bannerAddController.getBannerAdd
);

bannerAddRouter.get(
    '/all', 
    bannerAddController.getAllBannerAdds
);

bannerAddRouter.get(
    '/type/:type', 
    bannerAddController.getBannerAddsByType
);

bannerAddRouter.get(
    '/list/active', 
    bannerAddController.getActiveBannerAdds
);

bannerAddRouter.get(
    '/list/inactive', 
    bannerAddController.getInactiveBannerAdds
);

bannerAddRouter.post(
    '/create', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.createBannerAdd
);

bannerAddRouter.put(
    '/update/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.updateBannerAdd
);

bannerAddRouter.delete(
    '/delete/:id', 
    [
        authJwt.verifyToken, 
        authJwt.isAdmin, 
        bannerAddMiddleware.checkIfBannerExists
    ], 
    bannerAddController.deleteBannerAdd
);

module.exports = bannerAddRouter;