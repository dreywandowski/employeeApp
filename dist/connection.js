"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDV4 = exports.UUID = exports.sequelize = exports.DataTypes = void 0;
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_1.DataTypes; } });
Object.defineProperty(exports, "UUID", { enumerable: true, get: function () { return sequelize_1.UUID; } });
Object.defineProperty(exports, "UUIDV4", { enumerable: true, get: function () { return sequelize_1.UUIDV4; } });
(0, dotenv_1.config)();
const sequelize = new sequelize_1.Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql'
});
exports.sequelize = sequelize;
sequelize.authenticate()
    .then(() => {
    console.log("Connected successfully using Sequelize!!");
})
    .catch((err) => {
    console.error("Error connecting:", err);
});
//# sourceMappingURL=connection.js.map