module.exports = (sequelize, DataTypes) => {
    const GameType = sequelize.define("gameType", {
        id: {
            type: DataTypes.INTEGER,   
            primaryKey: true,           
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        shortDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        longDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url:{
            type: DataTypes.STRING,
            allowNull: false
        },
        picture: {
            type: DataTypes.TEXT,
            allowNull: false
        },  
        icon: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    return GameType;
}