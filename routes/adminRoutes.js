var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');

 // delete employee
router.delete('/remove_employe/:name', admin.deleteEmployee);

 // get employees
 router.get('/employees', admin.getEmployees);

  // get employee
  router.get('/employees/:name', admin.employee_id);



module.exports = router;