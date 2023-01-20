var express = require('express');
var router = express.Router();
var employee = require('../controllers/EmployeeController');
var leave = require('../controllers/LeaveController');
//var file_upload = require('../controllers/FileController');
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
    console.log("test Json request header is =="+content);
    next()
   }
      // index
  router.get('/', testJson, employee.index);

     // register employee   
  router.post('/employees/addEmployee',  [urlencodedParser, validateUser], employee.register);

    // verify new user
  router.post('/employees/verifyEmployee',  [urlencodedParser], employee.verifyMail);

   // login
  router.post('/employees/login',  urlencodedParser, employee.login);

    // edit profile
    router.put('/employees/updateEmployee/:name',  [auth, urlencodedParser, validateEditUser, verification], employee.editProfile);


    // upload profile picture
  //router.post('/employees/uploadPicture', [auth, urlencodedParser], file_upload.uploadPic);

    // verify token
    router.get('/verifyToken', [testJson, auth], employee.verify);




   // list leaves applied for by self
  router.get('/leaves/myLeaves', [auth, verification], leave.getLeaves);

  // cancel a leave
  router.get('/leaves/myLeaves/:id', [auth, urlencodedParser, verification], leave.getLeave);

    // create a leave
  router.post('/leaves/createLeave', [auth, urlencodedParser, userValidationRules(), validate, verification], leave.createLeave);

     // request a leave
  router.post('/leaves/requestLeave/:id', [auth, urlencodedParser, verification], leave.requestLeave);

       // cancel a leave
  router.post('/leaves/cancelLeave/:id', [auth, urlencodedParser, verification], leave.cancelLeave);



     // logout
  router.post('/employees/logout',  [auth,verification], employee.logout);


module.exports = router;
