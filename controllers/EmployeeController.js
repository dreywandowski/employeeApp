var users = require('../models/Users');
const bcrypt = require("bcrypt");


   // home route
   const index = (req, res, next) => {
    res.status(200).json({'message' : 'The API is up and running!', 
    'status':'Unauthenticated'});
}


// register employee
const register = (req, res) => {
    var qry = req.body;
    var values = [[qry.firstName, qry.lastName, qry.username,qry.age, qry.password, qry.admin]];

    // validate the user
    
    const errors = [];
    
    if(qry.username.length == '' || qry.username.length < 8 )errors.push('Username cannot have less than 8 characters');
    if(qry.password.length == '' || qry.password.length < 10 )errors.push('Password cannot have less than 10 characters');

    if(errors.length !== 0){
        res.status(401).json({'message' : 'Validation errors!', 
        'errors': errors, status: 0});
    }
   
    else{

    // hash the password and then save the user in the returned Promise
    function hashPassword(plaintextPassword) {
        bcrypt.hash(plaintextPassword, 15)
            .then(hash => {
                console.log("our hashed pwd:"+hash);
                return hash;
            })
            .then(pwd =>{
                users.sync().then(data =>{
                   // console.log('table synced OK, with entries from user!', qry);
                    const user = users.create({
                        firstName: qry.firstName,
                        username: qry.username,
                        lastName: qry.lastName,
                        password: pwd,
                        age: qry.age,
                        isAdmin: qry.admin
                    }).then(datad => {
                        res.status(201).json({'message' : 'User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!', 
                                          'status':1});
                    }).catch(err =>{
                        res.status(403).json({'message' : 'Error creating the user! ' + err, 
                                          'status':0});
                });
            });
            })
            .catch(err => {
                res.status(403).json({'message' : 'Error hashing the password ' + err, 
                                          'status':0});
            })
    }

    // run the function
    hashPassword(qry.password);
    }
  
    
}


// TO-DO: FIX Edit Profile endpoint
// edit profile
const editProfile = (req, res) => {
    var qry = req.body;
    const username = req.params.name;
    console.log(username);

    res.status(500).json({'message' : ' Error decrpyting user hash, kindly check the error msg!',
                                          'error': qry});
    
    users.sync().then(data =>{
       return users.update({
            where: {
                username: username
            }
        });
        }).then(resp => {
           let dbPwd = resp.password;
           
           // compare hashed db pwd against user input and verify
         const decrpyt =  () => bcrypt.compare(pwd, dbPwd)
                    .then(result => {
                        if(result)res.status(200).json({'message' :'User password match, Authenticated!', 'status' :result});
                        else res.status(401).json({'message' : 'Username or password dont match!',
                        'status': 'unauthenticated'});
                        
                    })
                    .catch(err =>{
                        res.status(500).json({'message' : ' Error decrpyting user hash, kindly check the error msg!',
                                          'error': err.message});
                    });

                    decrpyt();
                 }) .
        catch(err =>{
            res.status(404).json({'message' :'error retrieving user list !!', 'error' : err.message});
        });

    
    }

    // login
const login = (req, res) => {
    var qry = req.body;
    const username = qry.username;
    const pwd  = qry.password;
    
    users.sync().then(data =>{
       return users.findOne({
            where: {
                username: username
            }
        });
        }).then(resp => {
           let dbPwd = resp.password;
           
           // compare hashed db pwd against user input and verify
         const decrpyt =  () => bcrypt.compare(pwd, dbPwd)
                    .then(result => {
                        if(result)res.status(200).json({'message' :'User password match, Authenticated!', 'status' :result});
                        else res.status(401).json({'message' : 'Username or password dont match!',
                        'status': result});
                        
                    })
                    .catch(err =>{
                        res.status(500).json({'message' : ' Error decrpyting user hash, kindly check the error msg!',
                                          'error': err.message, 'status': 0});
                    });

                    decrpyt();
                 }) .
        catch(err =>{
            res.status(404).json({'message' :'error retrieving user list !!', 'error' : err.message, 'status': 0});
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
    logout,
    editProfile

}