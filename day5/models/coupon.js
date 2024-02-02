'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.coupon_connector, {
        foreignKey: "coupon_id",
      });
    }
  }
  coupon.init({
    coupon_name: DataTypes.STRING,
    coupon_prc_cut: DataTypes.DECIMAL,
    createdBy: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'coupon',
  });
  return coupon;
};