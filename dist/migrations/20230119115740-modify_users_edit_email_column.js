'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn('users', 'email', {
                unique: true,
                type: Sequelize.STRING
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20230119115740-modify_users_edit_email_column.js.map