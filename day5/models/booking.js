'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.customer, {
        foreignKey: 'customer_id',
        onDelete: "CASCADE"
      });

      this.hasMany(models.coupon_connector, {
        foreignKey: "booking_id",
      });

    }
  }
  booking.init({
    customer_id: DataTypes.INTEGER,
    booking_type: DataTypes.STRING,
    booking_price: DataTypes.DECIMAL,
    createdBy: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'booking',
  });
  return booking;
};