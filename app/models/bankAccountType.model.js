module.exports = (sequelize, DataTypes) => {
    const BankAccountType = sequelize.define('bankAccountType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return BankAccountType;
};
