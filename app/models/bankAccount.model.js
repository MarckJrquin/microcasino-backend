module.exports = (sequelize, DataTypes) => {
    const BankAccount = sequelize.define('bankAccount', {
        accountHolder: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        accountTypeID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bankNameID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isFavorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return BankAccount;
};
