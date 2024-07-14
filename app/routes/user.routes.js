const express = require('express');
const multer = require('multer');

const userController = require("../controllers/user.controller");
const { authJwt, verifyUserProfile, mediaCheck } = require("../middlewares");

const userRouter = express.Router({});
const upload = multer({ storage: multer.memoryStorage() });


userRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

userRouter.get(
    "/profile",      
    [
        authJwt.verifyToken
    ],
    userController.getProfile
);

userRouter.get(
    "/profile/photo",
    [
      authJwt.verifyToken
    ],
    userController.getPhotoProfile
);

userRouter.put(
    "/edit/profile",  
    [
        authJwt.verifyToken,
        verifyUserProfile.checkUserExists,
        verifyUserProfile.checkDuplicateUser, 
        verifyUserProfile.checkDuplicateEmail,
        verifyUserProfile.validateProfileUpdate
    ],
    userController.updateProfile
);

// Ruta para subir foto de perfil
userRouter.post(
    '/profile/upload', 
    [
        authJwt.verifyToken,
        upload.single('profilePicture'), 
        mediaCheck.imageValidator
    ],
    userController.uploadProfilePicture
);

// Ruta para eliminar foto de perfil
userRouter.delete(
    '/profile/delete', 
    [
        authJwt.verifyToken
    ],
    userController.deleteProfilePicture
);

userRouter.put(
    "/changepassword",
    [
        authJwt.verifyToken,
        verifyUserProfile.validateNewPassword,
        verifyUserProfile.checkChangePassword
    ],
    userController.changePass
);

userRouter.get('/test', (req, res) => {
    res.json({ message: 'endpoint working' });
});

userRouter.get(
    "/test/all",         
    userController.allAccess  
);  
  
userRouter.get(  
    "/test/user",        
    [
        authJwt.verifyToken
    ],   
    userController.userBoard  
);  

userRouter.get(
    "/test/mod",          
    [                         
      authJwt.verifyToken, 
      authJwt.isModerator
    ],
    userController.moderatorBoard
);

userRouter.get( 
    "/test/admin",        
    [                         
      authJwt.verifyToken,  
      authJwt.isAdmin
    ],
    userController.adminBoard
);


module.exports = userRouter;