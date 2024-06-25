var express = require('express');
var app = express();
var cors = require('cors');
var redis = require('redis');
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const generalRoutes = require('./routes/generalRoutes');
app.use(cors());
app.use('/api', employeeRoutes);
app.use('/api', adminRoutes);
app.use('/api', generalRoutes);
var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`my employee app backend server is running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
//# sourceMappingURL=index.js.map