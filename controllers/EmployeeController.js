var users = require('../models/Users');


/*const mysql = require('mysql');

const connection = mysql.createPool({
    host     : 'localhost',
    user     : 'dreywandowski',
    password : '000Drey-',
    database : 'node_js_apps',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });*/


   // home route
   const index = (req, res, next) => {
   res.status(200).send('The API is up and running!!');
}

// get all employees
const getEmployees = (req, res) => {
    users.sync().then(data =>{
        return users.findAll();
        }).then(resp => {
            resp.forEach(element => {
               console.log(element.toJSON()); 
            });
            res.status(200).send('User list retrieved succesfully!!');
        }).catch(err =>{
            console.log('error retrieving user list!', err);
            res.status(200).send('The API is up and running!!');
        });
}

// fix how to properly return list of all employees

// get an employee
const employee_id = function(req, res){
    connection.query('SELECT * FROM movies', (err, rows) => {
        if(err) throw err;
        data = rows;
        //console.log('now here in the data object: \n', data);
        console.log('I just want to be sure that the nodemon is Working OK! \n Now I am fine');
        //connection.end();
        
    });
res.render('movies', {movies: data});
//res.end('Movie Added Succesfully!');
}


// register employee
const register = (req, res) => {
    var qry = req.body;
    var values = [[qry.firstName, qry.lastName, qry.username,qry.age, qry.password, qry.admin]];
    console.log(qry);

    users.sync().then(data =>{
        console.log('table synced OK, with entries from user!', res);
        const user = users.create({
            firstName: qry.firstName,
            username: qry.username,
            lastName: qry.lastName,
            password: qry.password,
            age: qry.age,
            isAdmin: qry.admin
        }).then(datad => {
            console.log('our api user has been saved!');
            res.status(201).send('User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!');
        }).catch(err =>{
            console.log('error with creating this user!', err);
    });
});
    
}

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
  
});*/

module.exports = {
    index,
    getEmployees,
    employee_id,
    register

}