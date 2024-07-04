const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
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



const sendConfirmationEmail = async (to, token) => {
    try {
        const nombreEmpresa = 'MICROCASINO';
        const urlDominioEmpresa = `${frontendConfig.URL}`;
        const tipoAccion = 'Confirmación de Registro';

        const subject = 'Confirmación de Registro';
        const verificationLink = `${frontendConfig.URL}/verify-registration/${token}`;
        const text = `Hola, gracias por registrarte. Por favor confirma tu correo electrónico haciendo clic en el siguiente enlace:  ${verificationLink}`
        
        // Cargar y procesar el archivo HTML
        const source = fs.readFileSync('./app/mail/templates/emailConfirmation.html', 'utf-8').toString();
        const template = handlebars.compile(source);
        
        const replacements = {
            nombreEmpresa,
            tipoAccion,
            urlDominioEmpresa,
            verificationLink
        };

        const htmlContent = template(replacements);

        const mailOptions = {
            from: config.AUTH.USER,
            to,
            subject,
            text,
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

module.exports = {
    sendConfirmationEmail
};
