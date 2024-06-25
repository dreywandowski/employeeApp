import { DataTypes, sequelize } from '../connection';

// create a raw_logs model
const raw_logs = sequelize.define('raw_logs', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT('long'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});


export default raw_logs;





