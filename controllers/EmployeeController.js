var users = require('../models/Users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
                        email:qry.email,
                        department: qry.dept,
                        isAdmin: qry.admin
                    }).then(datad => {
                        const d = new Date();
                        d.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
                        const newD = new Date(d.getTime() + 86400);

                        var name = qry.username;
                        if(qry.admin === "1"){
                            role = 'admin';
                        }
                        else{
                            role = 'user'; 
                        }

                        const user_details = {username: name, role: role };
                        
                       //signing JWT token with user id
                          var token = jwt.sign({
                          user: name,
                          role: role
                          }, process.env.JWT_KEY, {
                         expiresIn: 86400
                         });
                        res.status(201).json({'message' : 'User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!', 
                        accessToken:token, user: user_details,expiresAt: newD, 'status':1});
                    }).catch(err =>{
                        res.status(403).json({'message' : 'Error creating the user or assigning a JWT token! ' + err, 
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

// edit profile

const editProfile = (req, res) => {
   var username = req.params.name;
    var qry = req.body;

    const errors = [];
    
    if(qry.firstName.length == '' || qry.firstName.length < 5 )errors.push('First name cannot have less than 5 characters');
    if(qry.lastName.length == '' || qry.lastName.length < 5 )errors.push('Last name cannot have less than 5 characters');
    if(qry.username == '')errors.push('Age cannot be empty');
    if(qry.password.length == '' || qry.password.length < 10 )errors.push('Password cannot have less than 10 characters');

    if(errors.length !== 0){
        res.status(401).json({'message' : 'Validation errors!', 
        'errors': errors, status: 0});
    }
 
    else{
    bcrypt.hash(req.body.password, 15)
            .then(hash => {
              /*  res.status(200).json({'message' : 'User updated successfully!',
                'status': hash});*/
               users.sync().then(data =>{
                     users.update({
                     firstName: req.body.firstName,
                     lastName: req.body.lastName,
                     password: hash,
                     age: req.body.age,
                         where: {
                             username: username
                         }
                        });
                    })
            }).then(resp =>{
                res.status(200).json({'message' : 'User updated successfully!',
                'status': 1});
            })
            .catch(err =>{
                res.status(401).json({'message' : ' Error updating user!',
                        'status': 0, message:err});
            });
    
        
    
    }
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
           const dbPwd = resp.password;
           let role = resp.isAdmin;
           if(resp.isAdmin === true){
          role = "admin";
         }
            else role = "user";
           const name  = resp.username;
           
        const user_details = {username: username, role: role };

           // compare hashed db pwd against user input and verify
         const decrpyt =  () => bcrypt.compare(pwd, dbPwd)
                    .then(result => {
                        if(result){

                            const d = new Date();
                            d.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
                            const newD = new Date(d.getTime() + 86400);

                           //signing JWT token with user id
                              var token = jwt.sign({
                              user: name,
                              role: role
                              }, process.env.JWT_KEY, {
                             expiresIn: 86400
                             });
                            res.status(200).json({'message' :'Login successful, Authenticated!', 'status' :result, accessToken:token, user: user_details,expiresAt: newD});
                        }
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
            res.status(404).json({'message' :'error verifying the user !!', 'error' : err.message, 'status': 0});
        });

    
    }


    

// logout
const logout = (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    const logout = jwt.sign({
        }, process.env.JWT_KEY, {
       expiresIn: -1
       });

       res.json(logout);
}


// Verification of JWT
const verify = (req, res) => {
   res.json(req.user);
    
}

module.exports = {
    index,
    register,
    login,
    logout,
    editProfile,
    verify

}