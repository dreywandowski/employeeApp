import { DataTypes, sequelize } from '../connection';


// create a job model
const Job = sequelize.define('jobs', {
  title: DataTypes.STRING,
  isOpen: DataTypes.BOOLEAN,
  yearsOfExperience: DataTypes.INTEGER,
  description: DataTypes.STRING,
  duties: DataTypes.STRING,
  qualifications: DataTypes.STRING,
  skills: DataTypes.STRING,
  end_date: DataTypes.DATE,
  department: DataTypes.STRING
});


Job.associate = function (models) {
  Job.belongsTo(models.application, {
    foreignKey: "job_id",
    sourceKey: "id"
  })

}
export default Job;
