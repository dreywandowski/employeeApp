var express = require('express');
var app = express();
var router = express.Router();
var admin = require('../controllers/AdminController');

 // get employees
 router.get('/employees', admin.getEmployees);

 // get employee
 router.get('/employees/:name', admin.employee_id);


// delete employee
router.delete('/api/delete_movie/:name', function(req, res){
    var name = req.params.name;
    // console.log("weyuej",qry);
     var sql = "DELETE FROM movies where name = ?";
     connection.query(sql, name, (err, rows) => {
         if(err) throw err;
         data = rows;
         console.log(data);
         res.end('Movie Deleted Succesfully!');
         
     }); 

});

module.exports = router;