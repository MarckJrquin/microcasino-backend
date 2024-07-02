const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const db = require("../models");
const User = db.user;
const Role = db.role;
const Person = db.person;
const Bank = db.bank;
const BankAccount = db.bankAccount;
const BankAccountType = db.bankAccountType;
const Product = db.product;


/* Middleware para verificar si el usuario del parametro existe */
const verifyUserExists = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.body.userId;
        
        if (!userId) {
            return res.status(400).send({ message: "Falta el ID del usuario" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar usuario!" });
    }
}

const verifyProductExists = async (req, res, next) => {
    try {
        
        const productId = req.params.id || req.body.id;
        
        if (!productId) {
            return res.status(400).send({ message: "Falta el ID del producto" });
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar producto!" });
    }

}


const verifyBankAccountExists = async (req, res, next) => {
    try {
        const bankAccountId = req.params.id || req.body.id;

        if (!bankAccountId) {
            return res.status(400).send({ message: "Falta el ID de la cuenta bancaria" });
        }

        const bankAccount = await BankAccount.findByPk(bankAccountId);

        if (!bankAccount) {
            return res.status(404).send({ message: "Cuenta bancaria no encontrada" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar cuenta bancaria!" });
    }
}


const verifyBankAccountRequest = async (req, res, next) => {

    const { accountHolder, accountNumber } = req.body;

    // if (!accountHolder || !accountNumber || !accountTypeID || !bankNameID || !userId) {
    //     return res.status(400).send({ message: "Faltan campos requeridos en la solicitud de cuenta bancaria" });
    // }

    // Validar que 'accountHolder' no contiene números
    if (accountHolder && /\d/.test(accountHolder)) {
        return res.status(400).send({ message: "El nombre no puede contener números" });
    }

    // Validar que 'accountNumber' no contiene letras
    if (accountNumber && /\D/.test(accountNumber)) {
        return res.status(400).send({ message: "El número de la cuenta bancaria no puede contener letras" });
    }

    next();
}


const checkDuplicateBankAccount = async (req, res, next) => {
    try {
        const id = req.body.id || req.params.id;
        const userID = req.body.userId || req.params.userId;

        const bankAccount = await BankAccount.findOne({ where: { id, userID } });

        if (bankAccount && bankAccount.id != id) {
            return res.status(400).send({ message: "Ya existe una cuenta bancaria con este número para el usuario" });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: "Error al verificar cuenta bancaria duplicada!" });
    }
}


const checkBankExists = async (req, res, next) => {
    try {
        const bankId = req.body.id || req.params.id;

        if (!bankId) {
            return res.status(400).send({ message: "Falta el ID del banco" });
        }

        const bank = await Bank.findByPk(bankId);

        if (!bank) {
            return res.status(404).send({ message: "Banco no encontrado" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar banco!" });
    }

}


const checkBankAccountTypeExists = async (req, res, next) => {
    try {
        const bankAccountTypeId = req.body.id || req.params.id;

        if (!bankAccountTypeId) {
            return res.status(400).send({ message: "Falta el ID del tipo de cuenta bancaria" });
        }

        const bankAccountType = await BankAccountType.findByPk(bankAccountTypeId);

        if (!bankAccountType) {
            return res.status(404).send({ message: "Tipo de cuenta bancaria no encontrado" });
        }
      
        next();
    }
    catch (error) {
        return res.status(500).send({ message: "Error al verificar tipo de cuenta bancaria!" });
    }
}


const billingMiddleware = {
    verifyUserExists,
    verifyProductExists,
    verifyBankAccountExists,
    verifyBankAccountRequest,
    checkDuplicateBankAccount,
    checkBankExists,
    checkBankAccountTypeExists
};
  

module.exports = billingMiddleware;
