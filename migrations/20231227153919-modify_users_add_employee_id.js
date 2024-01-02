'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
      return Promise.all([
        // remove old primary key
       // queryInterface.removeConstraint('users', 'PRIMARY'),

        // add new primary key
        queryInterface.addColumn(
          'users', 
          'employee_id', 
          {
            allowNull: false,
           // unique: true,
          //  allowNull: false,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
          },
        ),
       /* queryInterface.addConstraint('users', {
          fields: ['employee_id', 'username'],
          type: 'primary key',
          name: 'users_pk'
        },),*/
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
