const express = require('express');
const billingRouter = express.Router({});

const { authJwt, billingMiddleware } = require("../middlewares");
const billingController = require("../controllers/billing.controller");


billingRouter.use(function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


billingRouter.get(
    '/banks', 
    [
        authJwt.verifyToken
    ],  
    billingController.getBanks

);


billingRouter.get(
    '/bank-account-types', 
    [
        authJwt.verifyToken
    ],  
    billingController.getBankAccountTypes
);


billingRouter.get(
    '/user/:userId/bank-account/:id', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyBankAccountExists
    ],  
    billingController.getUserBankAccount
);


billingRouter.get(
    '/user/:userId/bank-accounts', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists
    ],  
    billingController.getUserBankAccounts
);


billingRouter.post(
    '/bank', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],  
    billingController.createBank
);


billingRouter.post(
    '/bank-account-type',
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],   
    billingController.createBankAccountType
);


billingRouter.post(
    '/user/create/bank-account', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyBankAccountRequest,
    ],  
    billingController.createUserBankAccount
);


billingRouter.post(
    '/create-checkout-session-for-products', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyProductExists
    ],
    billingController.createCheckoutSessionForProducts
);


billingRouter.post(
    '/create-checkout-session-for-credits', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
    ],
    billingController.createCheckoutSessionForCredits
);


// billingRouter.post(
//     '/webhook', 
//     express.raw({type: 'application/json'}),
//     billingController.webhook
// );


billingRouter.get(
    '/transaction-details',
    [
        authJwt.verifyToken
    ],
    billingController.getTransactionDetails
);


billingRouter.put(
    '/banks/:id', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        billingMiddleware.checkBankExists
    ],  
    billingController.updateBank
);


billingRouter.put(
    '/bank-account-types/:id',
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        billingMiddleware.checkBankAccountTypeExists
    ],   
    billingController.updateBankAccountType
);


billingRouter.put(
    '/user/update/bank-account/:id', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyBankAccountExists,
        billingMiddleware.verifyBankAccountRequest,
        billingMiddleware.checkDuplicateBankAccount
    ],  
    billingController.updateUserBankAccount
);


billingRouter.put(
    '/user/set/favorite-bank-account', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyBankAccountExists
    ],  
    billingController.setFavoriteBankAccount
);


billingRouter.delete(
    '/banks/:id', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        billingMiddleware.checkBankExists
    ],  
    billingController.deleteBank
);


billingRouter.delete(
    '/bank-account-types/:id', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        billingMiddleware.checkBankAccountTypeExists
    ],  
    billingController.deleteBankAccountType
);


billingRouter.delete(
    '/user/delete/bank-account', 
    [
        authJwt.verifyToken,
        billingMiddleware.verifyUserExists,
        billingMiddleware.verifyBankAccountExists
    ],  
    billingController.deleteUserBankAccount
);


billingRouter.get(
    '/user/:userId/credits',
    [
        authJwt.verifyToken
    ],
    billingController.getUserCreditsBalance
);


billingRouter.post(
    '/user/withdraw-credits',
    [
        authJwt.verifyToken
    ],
    billingController.withdrawCredits
);


billingRouter.get(
    '/user/:userId/transactions',
    [
        authJwt.verifyToken
    ],
    billingController.getCreditTransactionsHistory
);

billingRouter.get(
    '/user/:userId/games/',
    [
        authJwt.verifyToken
    ],
    billingController.getGameTransactionsHistory
);

billingRouter.post(
    '/user/record-win',
    [
        authJwt.verifyToken,
    ],
    billingController.recordWin
);

billingRouter.post(
    '/user/record-bet',
    [
        authJwt.verifyToken,
    ],
    billingController.recordBet
);


module.exports = billingRouter