'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      isOpen: {
        type: Sequelize.BOOLEAN
      },
      yearsOfExperience: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      duties: {
        type: Sequelize.STRING
      },
      qualifications: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Jobs');
  }
};