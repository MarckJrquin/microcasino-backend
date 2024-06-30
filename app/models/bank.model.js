module.exports = (sequelize, Sequelize) => {
    const Bank = sequelize.define('bank', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Bank;
};
