'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 /*   return Promise.all([
    queryInterface.addColumn(
      'leaves',
      'rejected_by',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    ]);*/
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('leaves');
     */
  }
};
