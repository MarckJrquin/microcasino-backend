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


const sendPasswordResetEmail = async (email, token) => {
    const nombreEmpresa = 'MICROCASINO';
    const urlDominioEmpresa = `${frontendConfig.URL}`;
    const tipoAccion = 'Recuperación de Contraseña';

    const subject = 'Recuperación de Contraseña';
    const resetPasswordLink = `${frontendConfig.URL}/password-reset/${token}`;
    const text = `Hola, parece que olvidaste tu contraseña. Puedes crear una nueva contraseña haciendo clic en el siguiente enlace:  ${resetPasswordLink}`
    
    // Cargar y procesar el archivo HTML
    const source = fs.readFileSync('./app/mail/templates/passwordRecovery.html', 'utf-8').toString();
    const template = handlebars.compile(source);

    const replacements = {
        nombreEmpresa,
        tipoAccion,
        urlDominioEmpresa,
        resetPasswordLink
    };

    const htmlContent = template(replacements);

    const mailOptions = {
        from: config.AUTH.USER,
        to: email,
        subject,
        text,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Error al enviar el correo", error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};


module.exports = {
    sendConfirmationEmail,
    sendPasswordResetEmail
};

