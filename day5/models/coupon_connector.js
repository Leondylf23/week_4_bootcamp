'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon_connector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.coupon, {
        foreignKey: 'coupon_id',
        onDelete: "CASCADE"
      });

      this.belongsTo(models.booking, {
        foreignKey: 'booking_id',
        onDelete: "CASCADE"
      });
    }
  }
  coupon_connector.init({
    coupon_id: DataTypes.INTEGER,
    booking_id: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'coupon_connector',
  });
  return coupon_connector;
};