const dotenv = require('dotenv');
const bcrypt = require ('bcryptjs');  
const Stripe = require('stripe');

const stripeConfig = require("../config/stripe.config");
const frontendConfig = require('../config/frontend.config');

const db = require("../models");
const billingRouter = require('../routes/billing.routes');
const User = db.user;
const Person = db.person;
const Bank = db.bank;
const BankAccount = db.bankAccount;
const BankAccountType = db.bankAccountType;
const UserCredit = db.userCredit;
const CreditTransaction = db.creditTransaction;
const Product = db.product;

const stripe = new Stripe(stripeConfig.STRIPE_SECRET_KEY);

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

        const bankAccount = await BankAccount.findOne({
            where: { userId, id },
            include: [
                {
                    model: BankAccountType,
                    attributes: ['name']
                },
                {
                    model: Bank,
                    attributes: ['name']
                }
            ]
        });

        return res.status(200).send(bankAccount);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}


/* -- Controlador para obtener cuentas bancarias de usuario -- */
const getUserBankAccounts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bankAccounts = await BankAccount.findAll({
            where: { userId },
            include: [
                {
                    model: BankAccountType,
                    attributes: ['name']
                },
                {
                    model: Bank,
                    attributes: ['name']
                }
            ]
        });
        return res.status(200).send(bankAccounts);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


/* -- Controlador para registrar cuenta bancaria de usuario -- */
const createUserBankAccount = async (req, res) => {
    try {
        const { accountHolder, accountNumber, accountTypeID, bankNameID, isFavorite, userId } = req.body;

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
        const userID = req.body.userId || req.params.userId;

        console.log("as", req.body);

        const fieldsToUpdate = filterValidFields(req.body);

        const [updated] = await BankAccount.update(fieldsToUpdate, {
            where: { id, userID },
        });
        
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



/* -- Controlador para manejar la creación de la sesión de Stripe -- */
const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.body.userId || req.params.userId;
        const productId = req.body.id || req.params.id;
        const amount = req.body.price || req.params.price;

        if (!userId || !productId || !amount) {
            return res.status(400).send({ message: "Faltan campos requeridos en la solicitud de depósito" });
        }

        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: amount * 100, // Stripe expects amounts in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${frontendConfig.URL}/payment/success`,
            cancel_url: `${frontendConfig.URL}/payment/cancel`,
            metadata: {
                userId: user.id,
                username: user.username,
                email: user.email,
                productId: product.id,
                productName: product.name,
                amount: amount,
            }
        });

        return res.status(201).send({ session });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const webhook = async (req, res) => {
    console.log('Webhook received', req.body);

    let event = req.body;
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

    if(endpointSecret) {
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body, 
                signature, 
                endpointSecret
            );
        } catch (error) {
            console.log(`⚠️  Webhook signature verification failed.`, error.message);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }

    let subscription;
    let status;
 

    if (event.type === 'checkout.session.completed') {

        console.log("Checkout session completed");

        const session = event.data.object;

        console.log("Session", session);

        // Obtener metadata
        const userId = session.metadata.userId;
        const productId = session.metadata.productId;

        console.log("User ID", userId);
        console.log("Product ID", productId);

        try {
            // Obtener detalles del producto
            const product = await Product.findByPk(productId);

            // Obtener el usuario
            const user = await User.findByPk(userId);

            console.log("User", user);
            console.log("Product", product);
            

            if (user && product) {
                console.log("User and Product found");

                // Actualizar el balance de créditos del usuario
                const userCredit = await UserCredit.findOne({ where: { userID: userId } });

                if (userCredit) {
                    console.log("UserCredit found");
                    userCredit.balance += product.dataValues.credits;
                    await userCredit.save();

                    // Registrar la transacción
                    await CreditTransaction.create({
                        userID: userId,
                        type: 'deposit',
                        credits: product.dataValues.credits,
                        amount: product.dataValues.price,
                        timestamp: new Date(),
                        stripeSessionId: session.id,
                        productID: productId
                    });

                    console.log("Transaction created");
                } else {
                    console.log(`UserCredit not found for user ID ${user.id}`);
                }
            } else {
                console.log(`User or Product not found: userId ${userId}, productId ${productId}`);
            }
        } catch (error) {
            console.error(`Error processing webhook: ${error.message}`);
        }
    }

    res.status(200).json({ received: true });
};


// const webhook = async (req, res) => {
//     console.log('Webhook received', req.body);

//     let signingSecret = process.env.STRIPE_SIGNING_SECRET;

//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SIGNING_SECRET);
//     } catch (error) {
//         console.log(`⚠️  Webhook signature verification failed.`);
//         return res.status(400).send(`Webhook Error: ${error.message}`);
//     }

//     if (event.type === 'checkout.session.completed') {

//         const session = event.data.object;

//         // Obtener metadata
//         const userId = session.metadata.userId;
//         const productId = session.metadata.productId;

//         try {
//             // Obtener detalles del producto
//             const product = await Product.findByPk(productId);

//             // Obtener el usuario
//             const user = await User.findByPk(userId);

//             if (user && product) {
//                 // Actualizar el balance de créditos del usuario
//                 const userCredit = await UserCredit.findOne({ where: { userID: user.id } });
//                 if (userCredit) {
//                     userCredit.balance += product.credits;
//                     await userCredit.save();

//                     // Registrar la transacción
//                     await CreditTransaction.create({
//                         userID: user.id,
//                         type: 'deposit',
//                         amount: product.credits,
//                         timestamp: new Date(),
//                         stripeSessionId: session.id
//                     });
//                 } else {
//                     console.log(`UserCredit not found for user ID ${user.id}`);
//                 }
//             } else {
//                 console.log(`User or Product not found: userId ${userId}, productId ${productId}`);
//             }
//         } catch (error) {
//             console.error(`Error processing webhook: ${error.message}`);
//         }
//     }

//     res.status(200).json({ received: true });
// };



// Utilidad para filtrar campos válidos


const filterValidFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
};


module.exports = {
    createCheckoutSession,
    webhook,
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






