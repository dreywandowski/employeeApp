const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;
const Leave = sequelize.define('leaves', {
    purpose: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    date_from: DataTypes.DATE,
    date_to: DataTypes.DATE,
    username: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    approved_by: DataTypes.STRING,
    rejected_by: DataTypes.STRING
});
Leave.associate = function (models) {
    Users.belongsTo(models.Users, {
        foreignKey: "username",
        sourceKey: "username"
    });
};
module.exports = Leave;
//# sourceMappingURL=leave.js.map