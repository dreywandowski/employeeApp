'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('file_uploads', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            file_type: {
                type: Sequelize.STRING
            },
            file_path: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('file_uploads');
    }
};
//# sourceMappingURL=20230110072007-add_file_uploads_table.js.map