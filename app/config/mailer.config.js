const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    HOST: process.env.MAIL_HOST, 
    SERVICE: process.env.MAIL_SERVICE,
    PORT: process.env.MAIL_PORT,
    SECURE: process.env.MAIL_SECURE,
    AUTH: {
        USER: process.env.MAIL_AUTH_USER, 
        PASS: process.env.MAIL_AUTH_PASS, 
    }
};
