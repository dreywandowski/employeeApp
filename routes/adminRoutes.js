var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');
var auth = require('../middleware/verifyToken');
var adminVerify = require('../middleware/verifyAdmin');
var leave = require('../controllers/LeaveController');
var applications = require('../controllers/ApplicationsController');
var jobs = require('../controllers/JobsController');

// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});

/////////////// EMPLOYEE ROUTES //////////////////////
 // delete employee
router.delete('/employees/removeEmployee/:name',[auth, adminVerify], admin.deleteEmployee);

 // get employees
 router.get('/employees', [auth, adminVerify], admin.getEmployees);

  // get employee
  router.get('/employees/:name', [auth, adminVerify], admin.employee_id);

  // assign employees to appropriate supervisor
  router.post('/employees/assignSupervisor/:name', [auth, adminVerify], admin.assignEmployee);

  ////////////////////////////////////////////////////////////////


/////////////// LEAVE ROUTES //////////////////////
  // get a list of leaves needing admin attention
  router.get('/leaves/attention', [auth, adminVerify], leave.getLeavesApproval);

  // approve a leave request
  router.post('/leaves/approve/:id', [auth, adminVerify], leave.approveLeave);

  // reject a leave request
  router.post('/leaves/reject/:id', [auth, adminVerify], leave.rejectLeave);

   ////////////////////////////////////////////////////////////////


/////////////// JOB ROUTES //////////////////////
  // view job applications
  router.get('/jobs/applications/', [auth, adminVerify], applications.getApplications);

   // view job application
   router.get('/jobs/applications/:id', [auth, adminVerify], applications.getApplication);

   // create job application
   router.post('/jobs/applications', [auth, urlencodedParser, adminVerify], jobs.postJob);

      ////////////////////////////////////////////////////////////////


module.exports = router;