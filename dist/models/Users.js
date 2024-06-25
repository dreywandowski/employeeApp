"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const Users = connection_1.sequelize.define('users', {
    employee_id: {
        type: connection_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: connection_1.DataTypes.UUIDV4,
    },
    firstName: {
        type: connection_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: connection_1.DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: connection_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: connection_1.DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: connection_1.DataTypes.INTEGER,
        allowNull: true
    },
    isAdmin: {
        type: connection_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    email: {
        type: connection_1.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    department: {
        type: connection_1.DataTypes.STRING,
        allowNull: true
    },
    supervisor: {
        type: connection_1.DataTypes.STRING,
        allowNull: true
    },
    subordinates: {
        type: connection_1.DataTypes.TEXT('long'),
        allowNull: true
    },
    jwt: {
        type: connection_1.DataTypes.STRING,
        allowNull: true
    },
    verifiedAt: {
        type: connection_1.DataTypes.DATE,
        allowNull: true
    },
    rank: {
        type: connection_1.DataTypes.STRING,
        allowNull: true
    }
});
exports.default = Users;
//# sourceMappingURL=Users.js.map