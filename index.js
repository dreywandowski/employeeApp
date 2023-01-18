var express = require('express');
var app = express();
var cors = require('cors');
var redis = require('redis');

// connect to Redis 
const client = redis.createClient();
(async () => {
    // Connect to redis server
    await client.connect();
})();
console.log("Attempting to connect to redis");
client.on('connect', () => {
    console.log('Connected to the redis server from the root file!');
});

// Log any error that may occur to the console
client.on("error", (err) => {
    console.log(`Error:${err}`);
});

// Close the connection when there is an interrupt sent from keyboard
process.on('SIGINT', () => {
    client.quit();
    console.log('redis client quit');
});


// tell node to use ejs as the templating engine
app.set('view engine', 'ejs');

// use middleware to serve up static files -- hint-- name the folder static for autobind
app.use('/assets', express.static('assets'));


// fire our routes
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const generalRoutes = require('./routes/generalRoutes');

// cors
app.use(cors());

// all routes
app.use('/api',employeeRoutes);
app.use('/api',adminRoutes);
app.use('/api',generalRoutes);

/*
var whitelist = ['http://example1.com', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/


// set our port
var port = process.env.PORT || 5000;


app.listen( port, () => {
    console.log( `my employee app backend server is running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
} );

