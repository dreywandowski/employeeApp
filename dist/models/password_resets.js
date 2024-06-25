"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const passwordResets = connection_1.sequelize.define('password_resets', {
    email: connection_1.DataTypes.STRING,
    token: connection_1.DataTypes.STRING
});
exports.default = passwordResets;
//# sourceMappingURL=password_resets.js.map