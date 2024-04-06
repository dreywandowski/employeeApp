'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
      queryInterface.addConstraint('Jobs', {
        fields: ['id'],
        type: 'foreign key',
        name: 'applications_fk',
        references: { 
          table: 'applications',
          field: 'job_id'
        },
       // onDelete: 'cascade',
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
