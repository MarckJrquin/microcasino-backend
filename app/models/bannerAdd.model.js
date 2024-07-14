module.exports = (sequelize, DataTypes) => {
    const BannerAdd = sequelize.define("bannerAdd", {
        id: {
            type: DataTypes.INTEGER,   
            primaryKey: true,           
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        iconUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        linkUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true
    });
    return BannerAdd;
};