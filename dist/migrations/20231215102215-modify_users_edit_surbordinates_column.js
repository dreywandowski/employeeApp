'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn('users', 'subordinates', {
                type: Sequelize.TEXT('long')
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20231215102215-modify_users_edit_surbordinates_column.js.map