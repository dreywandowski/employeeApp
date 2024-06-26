'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountName: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.INTEGER
      },
      bankName: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      username_recieved: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      trn_ref: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT(10, 2)
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
