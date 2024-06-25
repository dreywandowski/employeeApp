const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;
const transactions = sequelize.define('transactions', {
    accountName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    bankName: DataTypes.STRING,
    author: DataTypes.STRING,
    username_recieved: DataTypes.STRING,
    description: DataTypes.STRING,
    trn_ref: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});
module.exports = transactions;
//# sourceMappingURL=transaction.js.map