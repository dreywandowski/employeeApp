var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');
var auth = require('../middleware/verifyToken');

 // delete employee
router.delete('/remove_employe/:name', admin.deleteEmployee);

 // get employees
 router.get('/employees', auth,admin.getEmployees);

  // get employee
  router.get('/employees/:name', [auth], admin.employee_id);



module.exports = router;