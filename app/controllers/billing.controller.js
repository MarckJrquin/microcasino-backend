const bcrypt = require ('bcryptjs');  

const db = require("../models");
const User = db.user;
const Person = db.person;
const Bank = db.bank;
const BankAccount = db.bankAccount;
const BankAccountType = db.bankAccountType;


/* -- Controlador para obtener el listado de bancos -- */
const getBanks = async (req, res) => {
    try {
        const banks = await Bank.findAll();
        return res.status(200).send(banks);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para obtener el listado de tipo de cuentas bancarias -- */
const getBankAccountTypes = async (req, res) => {
    try {
        const bankAccountTypes = await BankAccountType.findAll();
        return res.status(200).send(bankAccountTypes);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para obtener cuentas bancarias de usuario -- */
const getUserBankAccount = async (req, res) => {
    try {
        const userId = req.params.userId;
        const id = req.params.id;

        const bankAccount = await BankAccount.findOne({where: { userId, id }});

        return res.status(200).send(bankAccount);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}


/* -- Controlador para obtener cuentas bancarias de usuario -- */
const getUserBankAccounts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bankAccounts = await BankAccount.findAll({where: { userId }});
        return res.status(200).send(bankAccounts);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para registrar cuenta bancaria de usuario -- */
const createUserBankAccount = async (req, res) => {
    try {
        const { accountHolder, accountNumber, accountTypeID, bankNameID, isFavorite = false, userId } = req.body;

        if (!accountHolder || !accountNumber || !accountTypeID || !bankNameID || !userId) {
            return res.status(400).send({ message: "Faltan campos requeridos en la solicitud de crear cuenta bancaria" });
        }

        const bankAccount = await BankAccount.create({ accountHolder, accountNumber, accountTypeID, bankNameID, isFavorite, userID: userId });
        return res.status(201).send(bankAccount);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para editar cuenta bancaria de usuario -- */
const updateUserBankAccount = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const { accountHolder, accountNumber, accountTypeID, bankNameID, isFavorite, userId } = req.body;

        // Construir objeto de actualización solo con campos proporcionados
        let updateFields = {};
        if (accountHolder !== undefined) updateFields.accountHolder = accountHolder;
        if (accountNumber !== undefined) updateFields.accountNumber = accountNumber;
        if (accountTypeID !== undefined) updateFields.accountTypeID = accountTypeID;
        if (bankNameID !== undefined) updateFields.bankNameID = bankNameID;
        if (isFavorite !== undefined) updateFields.isFavorite = isFavorite;

        const [updated] = await BankAccount.update(updateFields, { where: { id, userID: userId } });
        
        if (updated) {
            return res.status(200).send({ message: "Cuenta bancaria actualizada correctamente." });
        } else {
            return res.status(400).send({ message: "No se pudo actualizar la cuenta bancaria o no existe" });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador asignar una cuenta de banco diferente asociada como favorita  -- */
const setFavoriteBankAccount = async (req, res) => {
    try {
        const { userId, id } = req.body;

        // Reset all bank accounts' favorite status for the user
        await BankAccount.update({ isFavorite: false }, { where: { userId } });

        // Set the selected bank account as favorite
        const account = await BankAccount.update({ isFavorite: true }, { where: { id: id, userId } });

        if (account == 1) {
            res.status(200).send({message: "Cuenta bancaria favorita actualizada correctamente."});
        }
        else {
            res.status(404).send({ message: "No se pudo actualizar la cuenta bancaria favorita o no existe" });
        }
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};


/* -- Controlador para registrar un nuevo banco -- */
const createBank = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            return res.status(400).send({ message: "Falta el nombre del Banco" });
        }

        const bank = await Bank.create({ name });
        return res.status(201).send(bank);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para registrar un nuevo tipo de cuenta bancaria -- */
const createBankAccountType = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            return res.status(400).send({ message: "Falta el nombre del tipo de cuenta" });
        }

        const bankAccountType = await BankAccountType.create({ name });
        return res.status(201).send(bankAccountType);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para editar los datos de un registro de un banco -- */
const updateBank = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const bank = await Bank.update({ name }, { where: { id } });
        if (bank == 1) {
            return res.status(200).send({ message: "Datos de Banco actualizado correctamente." });
        } else {
            return res.status(400).send({ message: "No se pudo actualizar el banco o no existe" });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para editar los datos de un registro de tipo de cuenta bancaria -- */
const updateBankAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const bankAccountType = await BankAccountType.update({ name }, { where: { id } });
        if (bankAccountType == 1) {
            res.status(200).send({ message: "Bank account type updated successfully." });
        } else {
            res.status(404).send({ message: "Bank account type not found." });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para eliminar un banco -- */
const deleteBank = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Bank.destroy({ where: { id } });
        if (result) {
            res.status(200).send({ message: "Banco eliminado satisfactoriamente" });
        } else {
            res.status(404).send({ message: "No se encontro el banco" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/* -- Controlador para eliminar un tipo de cuenta bancaria -- */
const deleteBankAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BankAccountType.destroy({ where: { id } });
        if (result) {
            res.status(200).send({ message: "Tipo de cuenta bancaria eliminada satisfactoriamente" });
        } else {
            res.status(404).send({ message: "No se encontro tipo de cuenta bancaria" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/* -- Controlador para eliminar una cuenta bancaria -- */
const deleteUserBankAccount = async (req, res) => {
    try {
        const { id, userId } = req.body;
        const result = await BankAccount.destroy({ where: { id: id, userID: userId } });
        if (result) {
            res.status(200).send({ message: "Cuenta bancaria eliminada satisfactoriamente" });
        } else {
            res.status(404).send({ message: "Bank account not found." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/* -- Controlador para obtener el balance de la cuenta, wallet -- */



/* -- Controlador para obtener el historial de transacciones -- */



/* -- Controlador para obtener el historial de depósito de dinero -- */



/* -- Controlador para obtener el historial de retiro de dinero -- */



module.exports = {
    getBanks,
    getBankAccountTypes,
    getUserBankAccount,
    getUserBankAccounts,
    createBank,
    createBankAccountType,
    createUserBankAccount,
    updateBank,
    updateBankAccountType,
    updateUserBankAccount,
    setFavoriteBankAccount,    
    deleteBank,
    deleteBankAccountType,
    deleteUserBankAccount,
};






