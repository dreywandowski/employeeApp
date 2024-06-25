'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'rank', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20230127182635-modify_users_add_rank_field.js.map