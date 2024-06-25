'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn('applications', 'interview_date', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20240103162056-modify_applications_add_interview_date.js.map