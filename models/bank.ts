import { DataTypes, sequelize } from '../connection';


// create an account model
const bank = sequelize.define('bank_accounts', {
  accountName: DataTypes.STRING,
  accountNumber: DataTypes.STRING,
  bankName: DataTypes.STRING,
  bankCode: DataTypes.STRING,
  username: DataTypes.STRING
});


export default bank;
