"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const files = connection_1.sequelize.define('file_uploads', {
    name: connection_1.DataTypes.STRING,
    file_type: connection_1.DataTypes.STRING,
    file_path: connection_1.DataTypes.STRING,
    username: connection_1.DataTypes.STRING,
});
exports.default = files;
//# sourceMappingURL=files.js.map