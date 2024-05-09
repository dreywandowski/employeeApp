const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;

// create a raw_logs model
const transactions = sequelize.define('transactions', {
    accountName: DataTypes.STRING,
    accountNumber: DataTypes.TEXT('long'),
    bankName: DataTypes.DATE,
    author: DataTypes.DATE,
    username_recieved: DataTypes.STRING,
    description: DataTypes.TEXT('long'),
    trn_ref: DataTypes.TEXT('long'),
    amount: DataTypes.DECIMAL(10, 2),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});


module.exports = transactions;