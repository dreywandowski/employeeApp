"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const Leave = connection_1.sequelize.define('leaves', {
    purpose: connection_1.DataTypes.STRING,
    type: connection_1.DataTypes.STRING,
    status: connection_1.DataTypes.STRING,
    date_from: connection_1.DataTypes.DATE,
    date_to: connection_1.DataTypes.DATE,
    username: connection_1.DataTypes.STRING,
    approved: connection_1.DataTypes.BOOLEAN,
    approved_by: connection_1.DataTypes.STRING,
    rejected_by: connection_1.DataTypes.STRING
});
Leave.associate = function (models) {
    Leave.belongsTo(models.Users, {
        foreignKey: "username",
        targetKey: "username"
    });
};
exports.default = Leave;
//# sourceMappingURL=leave.js.map