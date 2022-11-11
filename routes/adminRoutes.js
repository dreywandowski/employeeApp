var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');
var auth = require('../middleware/verifyToken');
var adminVerify = require('../middleware/verifyAdmin');
var leave = require('../controllers/LeaveController');


 // delete employee
router.delete('/employees/removeEmployee/:name',[auth, adminVerify], admin.deleteEmployee);

 // get employees
 router.get('/employees', [auth, adminVerify], admin.getEmployees);

  // get employee
  router.get('/employees/:name', [auth, adminVerify], admin.employee_id);

  // get a list of leaves needing admin attention
  router.get('/leaves/attention', [auth, adminVerify], leave.getLeavesApproval);

  // approve a leave request
  router.post('/leaves/approve/:id', [auth, adminVerify], leave.approveLeave);

  // reject a leave request
  router.post('/leaves/reject/:id', [auth, adminVerify], leave.rejectLeave);


module.exports = router;