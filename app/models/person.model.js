module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define("person",{
        personID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        identification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        profile_picture: {
            type: DataTypes.STRING(100),
        }
    }, {
        freezeTableName: true
    });

    return Person;
};