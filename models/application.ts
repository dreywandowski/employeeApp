import { DataTypes, sequelize } from '../connection';


// create an application model
const application = sequelize.define('applications', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.INTEGER,
  address: DataTypes.STRING,
  location: DataTypes.STRING,
  skills: DataTypes.STRING,
  total_years_of_experience: DataTypes.INTEGER,
  proffessional_qualifications: DataTypes.STRING,
  jobAppliedFor: DataTypes.STRING,
  job_id: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  interview_date: DataTypes.DATE
});

application.associate = function (models) {
  application.hasMany(models.job, {
    foreignKey: "id",
    sourceKey: "job_id"
  })
}

module.exports = application;
