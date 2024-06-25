import { config } from 'dotenv';
import { DataTypes, Sequelize, UUID, UUIDV4 } from 'sequelize';

// Load environment variables from .env file
config();

// Create Sequelize instance with environment variables
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT), // Parse port to integer
    dialect: 'mysql'
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log("Connected successfully using Sequelize!!");
    })
    .catch((err: Error) => {
        console.error("Error connecting:", err);
    });

export { DataTypes, sequelize, UUID, UUIDV4 };

