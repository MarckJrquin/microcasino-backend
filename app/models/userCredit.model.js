module.exports = (sequelize, DataTypes) => {
    const UserCredit = sequelize.define("userCredit", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        }
    }, {
        freezeTableName: true
    });
    
    return UserCredit;
};