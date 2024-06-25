import { DataTypes, sequelize } from '../connection';


// create a job model
const files = sequelize.define('file_uploads', {
  name: DataTypes.STRING,
  file_type: DataTypes.STRING,
  file_path: DataTypes.STRING,
  username: DataTypes.STRING,
});


export default files;