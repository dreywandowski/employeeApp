"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const application = connection_1.sequelize.define('applications', {
    firstName: connection_1.DataTypes.STRING,
    lastName: connection_1.DataTypes.STRING,
    email: connection_1.DataTypes.STRING,
    phone: connection_1.DataTypes.INTEGER,
    address: connection_1.DataTypes.STRING,
    location: connection_1.DataTypes.STRING,
    skills: connection_1.DataTypes.STRING,
    total_years_of_experience: connection_1.DataTypes.INTEGER,
    proffessional_qualifications: connection_1.DataTypes.STRING,
    jobAppliedFor: connection_1.DataTypes.STRING,
    job_id: connection_1.DataTypes.INTEGER,
    status: connection_1.DataTypes.INTEGER,
    interview_date: connection_1.DataTypes.DATE
});
application.associate = function (models) {
    application.hasMany(models.job, {
        foreignKey: "id",
        sourceKey: "job_id"
    });
};
module.exports = application;
//# sourceMappingURL=application.js.map