module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("address", {
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        floorApartmentHouseNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isFavorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return Address;
};
