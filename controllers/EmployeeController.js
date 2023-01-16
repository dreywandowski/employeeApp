var users = require('../models/Users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 86450 });



   // home route
   const index = (req, res, next) => {
    res.status(200).json({'message' : 'The API is up and running!', 
    'status':'Unauthenticated'});
}


// assign user token utility
const assignuserToken = (username, role, email) => {
   //sign JWT token with user id
      var token = jwt.sign({
      user: username,
      role: role,
      email: email
      }, process.env.JWT_KEY, {
     expiresIn: 86400
     });

     // save tokens to the db against the user
     users.update(
        { jwt: token },
        { where: { username: username } }
      );

     // save token to a cache for fast retrieval
     let exists = cache.has('jwt_token_'+username);
     if(!exists){
    cache.set('jwt_token_'+username, token, 86444);
     }
     else{
        cache.del('jwt_token_'+username); 
        cache.set('jwt_token_'+username, token, 86444);
     }

     return token;
     
}


// register employee
const register = (req, res) => {
    var qry = req.body;

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
                        var email = qry.email;
                        if(qry.admin === "1"){
                            role = 'admin';
                        }
                        else{
                            role = 'user'; 
                        }
                        const user_details = {username: name, role: role };
                        
                           let token =  assignuserToken(name, role, email);
                           if(token !==''){
                            const d = new Date();
                            d.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
                            const newD = new Date(d.getTime() + 172800);

                           
                        res.status(201).json({'message' : 'User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!', 
                        accessToken:token, user: user_details,expiresAt: newD, 'status':1});
                           }
                           else{
                            res.status(500).json({'message' : 'Some error occured while trying to set tokens!', 'status': 0})
                           }
                           
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
  
    

// edit profile

const editProfile = (req, res) => {
   var username = req.params.name;
    var qry = req.body;

    bcrypt.hash(req.body.password, 15)
            .then(hash => {
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
           var email = resp.email;
           
        const user_details = {username: username, role: role, email:email };
      
           // compare hashed db pwd against user input and verify
         const decrpyt =  () => bcrypt.compare(pwd, dbPwd)
                    .then(result => {
                        if(result){
                           let token =  assignuserToken(username, role, email);
                           if(token !==''){
                            const d = new Date();
                            d.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
                            const newD = new Date(d.getTime() + 172800);

                            res.status(200).json({'message' :'Login successful.., Authenticated!', 'status' :result, accessToken:token, user: user_details,expiresAt: newD});
                           }
                           else{
                            res.status(500).json({'message' : 'Some error occured while trying to set tokens!', 'status': 0})
                           }
                           
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
    // update the token in the db against the user
    users.update(
        { jwt: null },
        { where: { username: req.user.user } }
      ).then(update =>{
        res.status(200).json({'message' :'Logout successful, Unauthenticated!', 'status' :1});
      }).
      catch(e => {
        res.status(500).json({'message' : ' Error logging out the user, kindly check the error msg!',
        'error': err.message, 'status': 0});
      });

       
}


// Verification of JWT
const verify = (req, res) => {
    mykeys = cache.keys();
   res.json( 'user == '+JSON.stringify(req.user) + ' '+JSON.stringify(mykeys));
    
}




module.exports = {
    index,
    register,
    login,
    logout,
    editProfile,
    verify

}