var express = require('express');
var router = express.Router();
var NodeCache = require('node-cache');
var employee = require('../controllers/EmployeeController');
var leave = require('../controllers/LeaveController');
var reset = require('../controllers/ResetPasswordController');
var files = require('../controllers/FileController');
var salary = require('../controllers/SalaryController');
var auth = require('../middleware/verifyToken');
const { userValidationRules, validate } = require('../middleware/validateInput');
const {validateUser } = require('../middleware/validateNewUser');
const {validateEditUser } = require('../middleware/validateEditUser');
const verification  = require('../middleware/checkUserVerified');

// handle POST requests
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded ({extended :false});



var testJson = (req, res, next) => {
    const content = req.headers['content-type'];
    console.log("test Json request header is == "+content);
    next()
   }
      // index
  router.get('/', testJson, employee.index);

   // clear cache
  router.get('/clear-cache', (req, res) => {
    var myCache = new NodeCache();
    myCache.clear();
    console.log('Cache cleared.');
    res.send('Cache cleared successfully.');
  });

  ///////////////////////////////////////////////
  ///////// EMPLOYEE SELF-SERVICE ROUTES ///////
  /////////////////////////////////////////////

  // initiate password reset
  router.post('/employees/forgotPassword',  [urlencodedParser], reset.forgot_pwd);

   // verify password reset pin
   router.post('/employees/verifyforgotPin',  [urlencodedParser], reset.verify_reset);
 
  // reset password
  router.post('/employees/resetPassword',  [urlencodedParser], reset.resetPwd);
     
  // resend registration token
 router.post('/employees/resendToken',  [urlencodedParser], employee.resend_token);

  // register employee   
  router.post('/employees/addEmployee',  [urlencodedParser, validateUser], employee.register);

    // verify new user
  router.post('/employees/verifyEmployee',  [urlencodedParser], employee.verifyMail);

   // login
  router.post('/employees/login',  [urlencodedParser], employee.login);

  // edit profile
  router.put('/employees/updateEmployee/:name',  [auth, urlencodedParser, validateEditUser, verification], employee.editProfile);



  // my salary breakdown
  router.get('/employees/mySalary/:name', [auth, verification], salary.mySalaryBreakDown);

  // download my salary pdf file
  router.get('/employees/downloadSalary', [auth, verification], salary.download);
 

    // upload profile picture
   router.post('/employees/uploadPicture', [auth, verification, urlencodedParser], files.uploadPic);

    // verify token
    router.get('/verifyToken', [testJson, auth], employee.verify);

    // logout
  router.post('/employees/logout',  [auth, verification, urlencodedParser], employee.logout);


  
   ///////////////////////////////////////////////
  ///////// EMPLOYEE LEAVE PORTAL ROUTES ///////
  /////////////////////////////////////////////

   // list leaves applied for by self
     // cancel a leave
  router.get('/leaves/myLeaves/:id', [auth, urlencodedParser, verification], leave.getLeave);
  
  router.get('/leaves/myLeaves', [auth, verification], leave.getLeaves);

    // create a leave
  router.post('/leaves/createLeave', [auth, urlencodedParser, userValidationRules(), validate, verification], leave.createLeave);

     // request a leave
  router.post('/leaves/requestLeave/:id', [auth, urlencodedParser, verification], leave.requestLeave);

       // cancel a leave
  router.post('/leaves/cancelLeave/:id', [auth, urlencodedParser, verification], leave.cancelLeave);



 


module.exports = router;
