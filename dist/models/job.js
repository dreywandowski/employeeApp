"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const Job = connection_1.sequelize.define('jobs', {
    title: connection_1.DataTypes.STRING,
    isOpen: connection_1.DataTypes.BOOLEAN,
    yearsOfExperience: connection_1.DataTypes.INTEGER,
    description: connection_1.DataTypes.STRING,
    duties: connection_1.DataTypes.STRING,
    qualifications: connection_1.DataTypes.STRING,
    skills: connection_1.DataTypes.STRING,
    end_date: connection_1.DataTypes.DATE,
    department: connection_1.DataTypes.STRING
});
Job.associate = function (models) {
    Job.belongsTo(models.application, {
        foreignKey: "job_id",
        sourceKey: "id"
    });
};
exports.default = Job;
//# sourceMappingURL=job.js.map