'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    /* return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leaves', 'username', {
          type: Sequelize.DataTypes.STRING
        }, 
        
        { transaction: t }),

        queryInterface.addColumn('leaves', 'approved', {
          type: Sequelize.DataTypes.BOOLEAN
        }, 
        
        { transaction: t }),
        
      ]);
    });*/
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
