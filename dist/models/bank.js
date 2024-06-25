"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const bank = connection_1.sequelize.define('bank_accounts', {
    accountName: connection_1.DataTypes.STRING,
    accountNumber: connection_1.DataTypes.STRING,
    bankName: connection_1.DataTypes.STRING,
    bankCode: connection_1.DataTypes.STRING,
    username: connection_1.DataTypes.STRING
});
exports.default = bank;
//# sourceMappingURL=bank.js.map