var express = require('express');
var router = express.Router();

// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});


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



    var testJson = (req, res, next) => {
        const content = req.headers['content-type'];
        console.log("test Json request header is =="+content);
       /* if (request.headers['content-type'] !== 'application/json') {
            response.status(400).send('Server requires application/json')
        } else {
          
        }*/
        next()
       }
    
      // put all our middleware to a single array and pass on
      //const middles = [index, testJson];


      // index
    router.get('/api', testJson, function(req, res){
        res.status(200).send('The API is up and running!!');
    });


    // get employees
    router.get('/api/employees', testJson, function(req, res){
        connection.query('SELECT * FROM movies', (err, rows) => {
            if(err) throw err;
            data = rows;
            //console.log('now here in the data object: \n', data);
            console.log('I just want to be sure that the nodemon is Working OK! \n Now I am fine');
            //connection.end();
            
        });
    res.render('movies', {movies: data});
    //res.end('Movie Added Succesfully!');
    });

    // get employee
    router.get('/api/employees/:name', function(req, res){
        connection.query('SELECT * FROM movies', (err, rows) => {
            if(err) throw err;
            data = rows;
            //console.log('now here in the data object: \n', data);
            console.log('I just want to be sure that the nodemon is Working OK! \n Now I am fine');
            //connection.end();
            
        });
    res.render('movies', {movies: data});
    //res.end('Movie Added Succesfully!');
    });

    /*app.get("/",(req,res) => {
        connection.query('CREATE TABLE movies (name VARCHAR(30), actor VARCHAR(30), RATING INT(10))', (err, rows) => {
            if(err) throw err;
            console.log('The data from movies table are: \n', rows);
            connection.end();
        });
    });*/

    // register employee
    router.post('/api/add_movies',  urlencodedParser, function(req, res){
        var qry = req.body;
        var values = [[qry.movie, qry.actor, qry.rating]];
        console.log(values);
        var sql = "INSERT INTO movies (name, actor, RATING) VALUES (?)   ";
        connection.query(sql, values, (err, result) => {
            if(err) throw err;
            console.log("Insert Operation successful!", result);
            res.end('Movie Added Succesfully!');
           // res.render('movies',{insertMsg : 'Movie Added Succesfully!'} );
            
        });

    });
    

     // update employee profile
     router.put('/api/update_movie/:name', function(req, res){
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



module.exports = router;
