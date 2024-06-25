"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const raw_logs = connection_1.sequelize.define('raw_logs', {
    title: connection_1.DataTypes.STRING,
    body: connection_1.DataTypes.TEXT('long'),
    createdAt: connection_1.DataTypes.DATE,
    updatedAt: connection_1.DataTypes.DATE
});
exports.default = raw_logs;
//# sourceMappingURL=raw_logs.js.map