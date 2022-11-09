var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');
var auth = require('../middleware/verifyToken');
var adminVerify = require('../middleware/verifyAdmin');

// verify user if its admin
/*var adminVerify = (req, res, next) => {
  const role = req.user.role;

  if(role === "admin"){
    next()
  }
  else{
    res.status(404).json({'message' : 'This user is not authorized to use this route!', 
            'status': 0});
  }
  
 }*/

 // delete employee
router.delete('/remove_employe/:name',[auth, adminVerify], admin.deleteEmployee);

 // get employees
 router.get('/employees', [auth, adminVerify], admin.getEmployees);

  // get employee
  router.get('/employees/:name', [auth, adminVerify], admin.employee_id);



module.exports = router;