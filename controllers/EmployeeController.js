var users = require('../models/Users');
const bcrypt = require("bcrypt");


   // home route
   const index = (req, res, next) => {
    res.status(200).json({'message' : 'The API is up and running!', 
    'status':'Unauthenticated'});
}


// TO-DO: FIX Login Endpoint
// login
const login = (req, res) => {
    var qry = req.body;
    const username = qry.username;
    const pwd  = qry.password;

    users.sync().then(data =>{
        return users.findAll({
            where: {
                username: username,
                //attributes : ['username', 'password']
            }
        });
        }).then(resp => {
           return resp.forEach(element => {
                console.log(element.toJSON()); 
                var user_list = element.toJSON();
            })
            
        }).then(user => {
            /*console.log("final the"+user_list.password);
            const hash_pwd = user.password;
            (pwd, hash_pwd) => {
                bcyrpt.compare(pwd, hash_pwd)
                    .then(result => {
                        console.log(result);
                        return result*/
                    })
        .
        catch(err =>{
            console.log('error retrieving user list!', err);
            res.status(200).send('error retrieving user list');
        });

    
    }


// logout
const logout = (req, res) => {
    users.sync().then(data =>{
        return users.findAll();
        }).then(resp => {
            resp.forEach(element => {
               console.log(element.toJSON()); 
            });
            res.status(200).send('User list retrieved succesfully!!');
        }).catch(err =>{
            console.log('error retrieving user list!', err);
            res.status(200).send('error retrieving user list');
        });
}


// register employee
const register = (req, res) => {
    var qry = req.body;
    var values = [[qry.firstName, qry.lastName, qry.username,qry.age, qry.password, qry.admin]];
    
    // hash the password and then save the user in the returned Promise
    function hashPassword(plaintextPassword) {
        bcrypt.hash(plaintextPassword, 15)
            .then(hash => {
                console.log("our hashed pwd:"+hash);
                return hash;
            })
            .then(pwd =>{
                users.sync().then(data =>{
                    console.log('table synced OK, with entries from user!', qry);
                    const user = users.create({
                        firstName: qry.firstName,
                        username: qry.username,
                        lastName: qry.lastName,
                        password: pwd,
                        age: qry.age,
                        isAdmin: qry.admin
                    }).then(datad => {
                        res.status(201).json({'message' : 'User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!', 
                                          'status':'OK!'});
                    }).catch(err =>{
                        res.status(405).json({'message' : 'Error creating the user!' + err, 
                                          'status':'Error!'});
                });
            });
            })
            .catch(err => {
                console.log(err)
            })
    }

    // run the function
    hashPassword(qry.password);

  
    
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
    register,
    login,
    logout

}