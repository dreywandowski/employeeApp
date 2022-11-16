var express = require('express');
var app = express();


// tell node to use ejs as the templating engine
app.set('view engine', 'ejs');

// use middleware to serve up static files -- hint-- name the folder static for autobind
app.use('/assets', express.static('assets'));


// fire our routes
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const generalRoutes = require('./routes/generalRoutes');



// all routes
app.use('/api',employeeRoutes);
app.use('/api',adminRoutes);
app.use('/api',generalRoutes);


// set our port
var port = process.env.PORT || 5000;


app.listen( port, () => {
    console.log( `my todo server is running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
} );