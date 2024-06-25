const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;
const passwordResets = sequelize.define('password_resets', {
    email: DataTypes.STRING,
    token: DataTypes.STRING
});
module.exports = passwordResets;
//# sourceMappingURL=password_resets.js.map