module.exports = (sequelize, Sequelize) => {
    const BankAccount = sequelize.define('bankAccount', {
        accountHolder: {
            type: Sequelize.STRING,
            allowNull: false
        },
        accountNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        accountTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        bankNameID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isFavorite: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return BankAccount;
};
