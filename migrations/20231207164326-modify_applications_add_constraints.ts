'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addConstraint('applications', {
        fields: ['job_id'],
        type: 'foreign key',
        name: 'jobs_fk',
        references: { 
          table: 'jobs',
          field: 'id'
        },
        //onDelete: 'cascade',
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
