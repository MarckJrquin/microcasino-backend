module.exports = (sequelize, DataTypes) => {
    const Bank = sequelize.define('bank', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Bank;
};
