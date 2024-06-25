'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('users', 'employee_id', {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20231227153919-modify_users_add_employee_id.js.map