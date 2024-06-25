'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('password_resets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING
            },
            token: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('password_resets');
    }
};
//# sourceMappingURL=20230118152944-create_password_resets_table.js.map