var express = require('express');
var router = express.Router();
var employee = require('../controllers/EmployeeController');
var leave = require('../controllers/LeaveController');
var auth = require('../middleware/verifyToken');
const { userValidationRules, validate } = require('../middleware/validateInput');


// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});



var testJson = (req, res, next) => {
    const content = req.headers['content-type'];
    console.log("test Json request header is =="+content);
    //res.status(401).json({ error: 'token crlkrsss', status : 0 })
   /* if (request.headers['content-type'] !== 'application/json') {
        response.status(400).send('Server requires application/json')
    } else {
      
    }*/

    next()
   }
      // index
    router.get('/', testJson, employee.index);

     // register employee   
     router.post('/employees/addEmployee',  urlencodedParser, employee.register);

      // login
    router.post('/employees/login',  urlencodedParser, employee.login);

    // verify token
   // router.get('/verifyToken', [testJson, auth], employee.verify);

   // list leaves applied for by self
   router.get('/leaves/myLeaves', [auth], leave.getLeaves);

  // cancel a leave
   router.get('/leaves/myLeaves/:id', [auth, urlencodedParser], leave.getLeave);

    // create a leave
    router.post('/leaves/createLeave', [auth, urlencodedParser, userValidationRules(), validate], leave.createLeave);

     // request a leave
     router.post('/leaves/requestLeave/:id', [auth, urlencodedParser], leave.requestLeave);

       // cancel a leave
       router.post('/leaves/cancelLeave/:id', [auth, urlencodedParser], leave.cancelLeave);


       // a problematic endpoint
    // edit profile
    router.put('/employees/updateEmployee/:name',  [urlencodedParser, auth], employee.editProfile);

    

  

     // logout
     router.post('/logout',  auth, employee.logout);


module.exports = router;
