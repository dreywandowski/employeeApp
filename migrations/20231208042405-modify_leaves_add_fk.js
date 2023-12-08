'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addConstraint('leaves', {
        fields: ['username'],
        type: 'foreign key',
        name: 'leave_users_fk',
        references: { 
          table: 'users',
          field: 'username'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },),
  ]);
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
