module.exports = (sequelize, DataTypes) => {
    const CreditTransaction = sequelize.define("creditTransaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false // "bet", "win", "deposit", "withdrawal"
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        stripeSessionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        freezeTableName: true
    });
    return CreditTransaction;
};