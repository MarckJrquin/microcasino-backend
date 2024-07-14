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
const getUserCreditsBalance = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId || req.userId;
        const userCredit = await UserCredit.findOne({ where: { userID: userId } });
        if (userCredit) {
            return res.status(200).send(userCredit);
        } else {
            return res.status(404).send({ message: "No se encontro el balance de créditos para el usuario" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/* -- Controlador para obtener el historial de transacciones -- */
const withdrawCredits = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId || req.userId;
        let { credits } = req.body;

        // Convertir credits a número
        credits = Number(credits);

        if (!credits || credits <= 0) {
            return res.status(400).send({ message: "La cantidad de créditos debe ser mayor que cero" });
        }

        const userCredits = await UserCredit.findOne({ where: { userID: userId } });

        if (userCredits && userCredits.credits >= credits) {
            userCredits.credits -= credits;
            await userCredits.save();

            const amount = credits * 0.25; // cada crédito vale $0.25

            await CreditTransaction.create({
                userID: userId,
                type: 'withdrawal',
                amount: amount,
                credits: credits
            });

            res.status(200).send({ message: "Retiro de créditos exitoso"});
        } else {
            res.status(400).send({ message: "No tienes suficientes créditos para realizar el retiro"});
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para obtener el historial de trasacciones -- */
const getCreditTransactionsHistory = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId || req.userId;
        const transactions = await CreditTransaction.findAll({ 
            where: { userID: userId } ,
            include: [
                {
                    model: Product
                }
            ]
        });

        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para manejar la creación de la sesión de Stripe -- */
const createCheckoutSessionForProducts = async (req, res) => {
    try {
        const userId = req.body.userId || req.params.userId;
        const productId = req.body.id || req.params.id;

        if (!userId || !productId) {
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
                        unit_amount: product.price * 100, // Stripe expects amounts in cents
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
                amount: product.price,
            }
        });

        // Guardar los detalles de la transacción en la sesión
        req.session.transactionDetails = {
            userId: user.id,
            username: user.username,
            email: user.email,
            productId: product.id,
            productName: product.name,
            amount: product.price,
            credits: product.credits,
        };

        return res.status(201).send({ session });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const createCheckoutSessionForCredits = async (req, res) => {
    try {
        const userId = req.body.userId || req.params.userId;
        let amount = req.body.amount || req.params.amount;

        if (!userId || !amount) {
            return res.status(400).send({ message: "Faltan campos requeridos en la solicitud de depósito" });
        }

        // Convertir amount a número
        amount = Number(amount);

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        const credits = Math.floor(amount / 0.25); // Conversión de dinero a créditos
        const productName = `Conversion to Credits (${credits} credits)`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
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
                amount,
                credits,
            }
        });

        // Guardar los detalles de la transacción en la sesión
        req.session.transactionDetails = {
            userId: user.id,
            username: user.username,
            email: user.email,
            productName: productName,
            amount,
            credits,
        };

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

    if (event.type === 'checkout.session.completed') {
        console.log("Checkout session completed");

        const session = event.data.object;

        console.log("Session", session);

        // Obtener metadata
        const userId = session.metadata.userId;
        const username = session.metadata.username;
        const email = session.metadata.email;
        const productId = session.metadata.productId;
        const amount = session.metadata.amount;
        const productName = session.metadata.productName;
        let credits = session.metadata.credits;

        credits = Number(credits);

        console.log("session", session);
        console.log("User ID", userId);
        console.log("Product ID", productId);
        console.log("Amount", amount);
        console.log("Credits", credits);

        try {
            // Obtener el usuario
            const user = await User.findByPk(userId);
            if (!user) {
                console.log(`User not found: userId ${userId}`);
                return res.status(404).send({ message: "Usuario no encontrado" });
            }

            // Obtener o crear el registro de UserCredit
            let userCredit = await UserCredit.findOne({ where: { userID: userId } });
            if (!userCredit) {
                userCredit = await UserCredit.create({ userID: userId, credits: 0 });
            }

            // Caso 1: Compra de producto
            if (productId) {
                // Obtener detalles del producto
                const product = await Product.findByPk(productId);
                if (!product) {
                    console.log(`Product not found: productId ${productId}`);
                    return res.status(404).send({ message: "Producto no encontrado" });
                }

                // Actualizar créditos del usuario
                userCredit.credits += product.dataValues.credits;
                await userCredit.save();

                // Registrar la transacción
                await CreditTransaction.create({
                    userID: userId,
                    type: 'deposit',
                    amount: product.dataValues.price,
                    credits: product.dataValues.credits,
                    stripeSessionId: session.id,
                    productID: productId
                });

                console.log("Transaction for product purchase created");

            } else {
                // Caso 2: Conversión de dinero a créditos
                // Actualizar créditos del usuario
                userCredit.credits += parseInt(credits);
                await userCredit.save();

                // Registrar la transacción
                await CreditTransaction.create({
                    userID: userId,
                    type: 'deposit',
                    amount: amount,
                    credits: credits,
                    stripeSessionId: session.id,
                    productName: productName
                });

                console.log("Transaction for credits conversion created");
            }
        } catch (error) {
            console.error(`Error processing webhook: ${error.message}`);
        }
    }

    res.status(200).json({ received: true });
};


const getTransactionDetails = async (req, res) => {
    if (!req.session.transactionDetails) {
        return res.status(404).send({ message: 'Transaction details not found' });
    }
    res.send(req.session.transactionDetails);
}


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
    createCheckoutSessionForProducts,
    createCheckoutSessionForCredits,
    webhook,
    getTransactionDetails,
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
    getUserCreditsBalance,
    withdrawCredits,
    getCreditTransactionsHistory
};






