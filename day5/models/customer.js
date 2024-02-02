'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.booking, {
        foreignKey: "customer_id",
      });
    }
  }
  customer.init({
    customer_name: DataTypes.STRING,
    customer_dob: DataTypes.DATE,
    createdBy: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'customer',
  });
  return customer;
};