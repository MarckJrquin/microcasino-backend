module.exports = (sequelize, DataTypes) => {
    const UserCredit = sequelize.define("userCredit", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        credits: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {
        freezeTableName: true
    });
    
    return UserCredit;
};