const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;


// create a job model
const Job = sequelize.define('Job', {
  title: DataTypes.STRING,
  isOpen: DataTypes.BOOLEAN,
  yearsOfExperience: DataTypes.INTEGER,
  description: DataTypes.STRING,
  duties: DataTypes.STRING,
  qualifications: DataTypes.STRING,
  skills: DataTypes.STRING,
  end_date: DataTypes.DATE
 });
 

 Job.associate = function(models){
  Job.belongsTo(models.application, {
      foreignKey: "job_id",
      sourceKey: "id"
  })

}
 module.exports = Job;
 