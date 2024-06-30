module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      id: {
        type: DataTypes.INTEGER,   
        primaryKey: true,           
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING  
      },  
      email: {  
        type: DataTypes.STRING   
      },  
      password: {  
        type: DataTypes.STRING   
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      freezeTableName: true
    });
  
    return User; 
  };
  