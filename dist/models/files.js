const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;
const files = sequelize.define('file_uploads', {
    name: DataTypes.STRING,
    file_type: DataTypes.STRING,
    file_path: DataTypes.STRING,
    username: DataTypes.STRING,
});
module.exports = files;
//# sourceMappingURL=files.js.map