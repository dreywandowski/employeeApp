const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;


// create an account model
const bank = sequelize.define('bank_accounts', {
  accountName: DataTypes.STRING,
  accountNumber: DataTypes.STRING,
  bankName: DataTypes.STRING,
  bankCode: DataTypes.STRING,
  username: DataTypes.STRING,
  paystack_id: DataTypes.STRING
 });
 

 module.exports = bank;
