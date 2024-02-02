'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'customers',
          key: 'id',
          as: 'customer_id',
        }
      },
      booking_type: {
        type: Sequelize.STRING
      },
      booking_price: {
        type: Sequelize.DECIMAL(10,2)
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
    await queryInterface.dropTable('bookings');
  }
};