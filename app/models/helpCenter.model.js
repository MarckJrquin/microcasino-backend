module.exports = (sequelize, DataTypes) => {
    const HelpCenter = sequelize.define('helpCenter', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
            defaultValue: 'Pending',
        },
        solution: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        freezeTableName: true
    });

    return HelpCenter;
};
