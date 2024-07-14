module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    return Product;
};