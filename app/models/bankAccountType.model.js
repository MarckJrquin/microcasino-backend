module.exports = (sequelize, Sequelize) => {
    const BankAccountType = sequelize.define('bankAccountType', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return BankAccountType;
};
