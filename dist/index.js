"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("cors");
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const adminRoutes_1 = require("./routes/adminRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use('/assets', express_1.default.static('assets'));
app.use((0, cors_1.default)());
app.use('/api', adminRoutes_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`My employee app backend server is running at http://localhost:${port}`);
    console.log('Press CTRL+C to stop server');
});
//# sourceMappingURL=index.js.map