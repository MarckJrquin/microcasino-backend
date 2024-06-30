const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    URL: process.env.FRONTEND_URL || "http://localhost:5176",
};
  