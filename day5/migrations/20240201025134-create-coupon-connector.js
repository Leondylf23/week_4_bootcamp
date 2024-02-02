'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupon_connectors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'coupons',
          key: 'id',
          as: 'coupon_id',
        }
      },
      booking_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'bookings',
          key: 'id',
          as: 'booking_id',
        }
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
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
    await queryInterface.dropTable('coupon_connectors');
  }
};