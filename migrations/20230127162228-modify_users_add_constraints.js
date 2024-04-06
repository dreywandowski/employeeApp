'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
      queryInterface.addConstraint('users', {
        fields: ['username'],
        type: 'foreign key',
        name: 'users_leave_fk_key',
        references: { 
          table: 'leaves',
          field: 'username'
        },
       // onDelete: 'cascade',
        onUpdate: 'cascade'
      },),
  ]);
  },

   
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
