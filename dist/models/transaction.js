"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const transactions = connection_1.sequelize.define('transactions', {
    accountName: connection_1.DataTypes.STRING,
    accountNumber: connection_1.DataTypes.STRING,
    bankName: connection_1.DataTypes.STRING,
    author: connection_1.DataTypes.STRING,
    username_recieved: connection_1.DataTypes.STRING,
    description: connection_1.DataTypes.STRING,
    trn_ref: connection_1.DataTypes.STRING,
    amount: connection_1.DataTypes.DECIMAL(10, 2),
    createdAt: connection_1.DataTypes.DATE,
    updatedAt: connection_1.DataTypes.DATE
});
exports.default = transactions;
//# sourceMappingURL=transaction.js.map