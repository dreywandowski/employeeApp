'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('applications', 'jobAppliedFor', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20221116121925-modify_applications_add_new_fields.js.map