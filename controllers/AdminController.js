var users = require('../models/Users');

// get all employees
const getEmployees = (req, res) => {
    users.sync().then(data =>{
        return users.findAll();
        }).
        then(users =>{
           /*  .then(resp => {
                resp.forEach(element => {
                    console.log(element.toJSON()); 
                    var user_list = element.toJSON();
                    
                 }
                 return resp;
             })*/
                res.status(200).json({'message' : 'User list retrieved sucessfully!', 
                'users': users});
            }).
        catch(err =>{
            res.status(404).send('error retrieving user list', err);
        });

}

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


module.exports = {
    getEmployees,
    employee_id
}