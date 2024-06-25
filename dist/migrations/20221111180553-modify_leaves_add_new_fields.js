'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('leaves', 'approved_by', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
            queryInterface.addColumn('leaves', 'rejected_by', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20221111180553-modify_leaves_add_new_fields.js.map