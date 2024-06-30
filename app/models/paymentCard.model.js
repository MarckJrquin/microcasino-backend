const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const PaymentCard = sequelize.define('paymentCard', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            set(value) {
                this.setDataValue('number', bcrypt.hashSync(value, 8));
            }
        },
        expiryDate: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isFavorite: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return PaymentCard;
};
