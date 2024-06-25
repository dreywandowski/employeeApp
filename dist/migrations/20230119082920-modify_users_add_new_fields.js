'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('users', 'verifiedAt', {
                type: Sequelize.DATE,
                allowNull: true,
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20230119082920-modify_users_add_new_fields.js.map