const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;

// create a password_resets model
const passwordResets = sequelize.define('password_resets', {
 email: DataTypes.STRING,
 token: DataTypes.STRING
});


module.exports = passwordResets;





