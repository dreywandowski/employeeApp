var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');
var auth = require('../middleware/verifyToken');
var adminVerify = require('../middleware/verifyAdmin');
var leave = require('../controllers/LeaveController');
var applications = require('../controllers/ApplicationsController');
var jobs = require('../controllers/JobsController');
var salary = require('../controllers/SalaryController');
var verification  = require('../middleware/checkUserVerified');

// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});

/////////////// EMPLOYEE ROUTES //////////////////////
 // delete employee
router.delete('/employees/removeEmployee/:name',[auth, verification, adminVerify], admin.deleteEmployee);

 // get employees
 router.get('/employees', [auth, verification, adminVerify], admin.getEmployees);

  // get employee
  router.get('/employees/:name', [auth, verification, adminVerify], admin.employee_id);

  // assign employees to appropriate supervisor
  router.post('/employees/assignSupervisor/:name', [auth, verification, adminVerify], admin.assignEmployee);

  // rank employee for salary grade purposes
  router.post('/employees/rankEmployee/:name', [auth, verification, adminVerify, urlencodedParser], admin.rankEmployee);

  // calculate staff salary
  router.post('/employees/calculateSalary/:name', [auth, verification, adminVerify], salary.calculateSalary);


  ////////////////////////////////////////////////////////////////


/////////////// LEAVE ROUTES //////////////////////
  // get a list of leaves needing admin attention
  router.get('/leaves/attention', [auth, verification, adminVerify], leave.getLeavesApproval);

  // approve a leave request
  router.post('/leaves/approve/:id', [auth, verification, adminVerify], leave.approveLeave);

  // reject a leave request
  router.post('/leaves/reject/:id', [auth, verification, adminVerify], leave.rejectLeave);

   ////////////////////////////////////////////////////////////////


/////////////// JOB ROUTES //////////////////////
  // view job applications
  router.get('/jobs/applications/', [auth,verification,  adminVerify], applications.getApplications);

   // view job application
   router.get('/jobs/applications/:id', [auth, verification, adminVerify], applications.getApplication);

   // create job application
   router.post('/jobs/applications', [auth, urlencodedParser,verification, adminVerify], jobs.postJob);

      ////////////////////////////////////////////////////////////////


module.exports = router;