import { DataTypes, sequelize } from '../connection';

// create a password_resets model
const passwordResets = sequelize.define('password_resets', {
    email: DataTypes.STRING,
    token: DataTypes.STRING
});


export default passwordResets;





