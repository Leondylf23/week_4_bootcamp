'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupon_name: {
        type: Sequelize.STRING
      },
      coupon_prc_cut: {
        type: Sequelize.DECIMAL(10, 2)
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupons');
  }
};