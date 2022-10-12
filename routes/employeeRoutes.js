var express = require('express');
var router = express.Router();
var employee = require('../controllers/EmployeeController');
//var env = require('./connection');


// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});
const {body, validationResult} = require('express-validator');

var testJson = (req, res, next) => {
    const content = req.headers['content-type'];
    console.log("test Json request header is =="+content);
   /* if (request.headers['content-type'] !== 'application/json') {
        response.status(400).send('Server requires application/json')
    } else {
      
    }*/
    next()
   }
      // index
    router.get('/', testJson, employee.index);

     // register employee   
     router.post('/add_employee',  urlencodedParser, employee.register);

      // login
    router.post('/login',  urlencodedParser, employee.login);

    // edit profile
    router.put('/update_employee/:name',  urlencodedParser, employee.editProfile);

    // verify token
   // app.post("/verifyToken", urlencodedParser, employee.verify);

     // logout
     router.post('/logout',  urlencodedParser, employee.logout);


module.exports = router;
