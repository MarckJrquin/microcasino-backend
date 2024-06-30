const nodemailer = require('nodemailer');
const config = require('../config/mailer.config');
const frontendConfig = require('../config/frontend.config');

const transporter = nodemailer.createTransport({
    host: config.HOST,
    service: config.SERVICE,
    port: config.PORT,
    secure: config.SECURE, // true for 465, false for other ports
    auth: {
        user: config.AUTH.USER,
        pass: config.AUTH.PASS
    }
});

const sendConfirmationEmail = (to, token) => {

    const verificationLink = `${frontendConfig.URL}/verify-registration/${token}`;

    const subject = 'Confirmación de Registro';

    const text = `Hola, gracias por registrarte. Por favor confirma tu correo electrónico haciendo clic en el siguiente enlace:  
                 ${verificationLink}`

    const mailOptions = {
        from: config.AUTH.USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = {
    sendConfirmationEmail
};
