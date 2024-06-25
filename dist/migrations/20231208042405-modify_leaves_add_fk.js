'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addConstraint('leaves', {
                fields: ['username'],
                type: 'foreign key',
                name: 'leave_users_fk',
                references: {
                    table: 'users',
                    field: 'username'
                },
                onUpdate: 'cascade'
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20231208042405-modify_leaves_add_fk.js.map