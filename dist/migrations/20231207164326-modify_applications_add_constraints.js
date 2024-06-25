'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addConstraint('applications', {
                fields: ['job_id'],
                type: 'foreign key',
                name: 'jobs_fk',
                references: {
                    table: 'jobs',
                    field: 'id'
                },
                onUpdate: 'cascade'
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20231207164326-modify_applications_add_constraints.js.map