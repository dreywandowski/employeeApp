const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;
const raw_logs = sequelize.define('raw_logs', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT('long'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});
module.exports = raw_logs;
//# sourceMappingURL=raw_logs.js.map