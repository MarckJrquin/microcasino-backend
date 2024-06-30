const express = require('express');
const authRouter = express.Router({})

const { verifySignUp, verifyForgotPass } = require("../middlewares");
const authController = require("../controllers/auth.controller");


authRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// authRouter.use(
//     authController.checkUnconfirmedUsers
// );


authRouter.post(
    "/signin",
    authController.signin
);

authRouter.post(
    "/signout",
    authController.signout
);

authRouter.post(
    "/signup",
    [
        verifySignUp.validateUsernameAndEmail,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.validatePassword,
        verifySignUp.checkRolesExisted,
        verifySignUp.checkName,
        verifySignUp.checkLastName,
        verifySignUp.checkIdentification,
        verifySignUp.checkBirthDate
    ],
    authController.signup
);

authRouter.put(
    "/forgotpassword",
    [
        verifyForgotPass.checkUsername,
        verifySignUp.validatePassword
    ],
    authController.forgotPassword
);

authRouter.get(
    "/confirm/:token",
    authController.confirmRegistration
);

authRouter.get('/test', (req, res) => {
    res.json({ message: 'endpoint working' });
});


module.exports = authRouter