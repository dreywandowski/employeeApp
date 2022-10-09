var express = require('express');
var router = express.Router();
var employee = require('../controllers/EmployeeController');

// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});

var testJson = (req, res, next) => {
    const content = req.headers['content-type'];
    console.log("test Json request header is =="+content);
   /* if (request.headers['content-type'] !== 'application/json') {
        response.status(400).send('Server requires application/json')
    } else {
      
    }*/
    next()
   }
      // index
    router.get('/', testJson, employee.index);

    // get employees
    router.get('/employees', employee.getEmployees);

    // get employee
    router.get('/employees/:name', employee.employee_id);

   // register employee
    router.post('/add_employee',  urlencodedParser, employee.register);
    

    /*
     // update employee profile
     router.put('/update_movie/:name', function(req, res){
        var name = req.params.name;
       // console.log("weyuej",qry);
        var sql = "SELECT * FROM movies where name = ?";
        connection.query(sql, name, (err, rows) => {
            if(err) throw err;
            data = rows;
            console.log(data);
            res.render('update_movie', {movie: data});
            
        });
      
    });
*/


module.exports = router;
