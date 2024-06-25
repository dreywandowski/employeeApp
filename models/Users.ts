import { DataTypes, sequelize } from '../connection';

// create a users table
const Users = sequelize.define('users', {
    // Model attributes are defined here
    employee_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supervisor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subordinates: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    jwt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rank: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Define associations if needed
// Users.associate = function(models) {
//     Users.hasMany(models.leaves, {
//         foreignKey: "username",
//         sourceKey: "username"
//     })
// }

export default Users;
