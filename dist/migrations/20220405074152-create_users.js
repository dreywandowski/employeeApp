'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            firstName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            isAdmin: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true
            },
            department: {
                type: Sequelize.STRING,
                allowNull: true
            },
            supervisor: {
                type: Sequelize.STRING,
                allowNull: true
            },
            subordinates: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
            jwt: {
                type: Sequelize.STRING,
                allowNull: true
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
    }
};
//# sourceMappingURL=20220405074152-create_users.js.map