'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('applications', 'status', {
                type: Sequelize.INTEGER,
                allowNull: true,
            }),
            queryInterface.addColumn('applications', 'portfolio_link', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },
    async down(queryInterface, Sequelize) {
    }
};
//# sourceMappingURL=20231227154301-modify_applications_add_status_and_portfolio.js.map