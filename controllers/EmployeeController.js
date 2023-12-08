var users = require('../models/Users');
var password_resets = require('../models/password_resets');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 86450 });
const env = require('dotenv').config();
const EventEmitter = require('events');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
var eventEmitter = new EventEmitter();

   // home route
const index = (req, res, next) => {
    res.status(200).json({'message' : 'The API is up and running on port 5000', 
    'status':'Unauthenticated'}); 
}


 // send mail to the new user for verification
 eventEmitter.on('sendVerifyAccount', (pin, email) => {
    const sendEmail = (receiver, subject, content) => {
         user = process.env.MAIL_USERNAME;
         pass = process.env.MAIL_PWD;

        let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: user,
          pass: pass
        }
     });

     ejs.renderFile('/var/www/html/payroll/assets/templates/new_user_verify.ejs', {content:pin}, (err, data) => {
        if (err) {
          console.log("error opening the file!! "+err);
        } else {
          var mailOptions = {
            from: 'admin@employeeapp.com',
            to: email,
            subject: subject,
            html: data
          };
        }
   
   transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log("cant send mail!! " + err);
       } else {
         console.log("mail sent ok "+"content=="+ msg+info);
       }
   });
});
}
        sendEmail(email, "Verify your account");
 });

// assign new user token utility
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
     obj = { k: username, val: token };

     if(!exists){
    cache.set('jwt_token_'+username, obj, 86444);
     }
     else{
        cache.del('jwt_token_'+username); 
        cache.set('jwt_token_'+username, obj, 86444);
     }

     return token;
     
}

// new user verification initiation
const new_user_verify = (email) => {
    var check = password_resets.findOne({
        where: {
            email: email
        }
    }).then(data => {
     if(data !== null){
       password_resets.update({where: {
        email: email
    }
});
     }
     else{
       const pin =  Math.floor(Math.random() * 999999) + 100000;
       password_resets.create({
        email: email,
        token: pin
       }).then(msg =>{
        if (msg === null){
            throw Error("unable to create a verification pin");
        }
        else{
            eventEmitter.emit('sendVerifyAccount', pin,email);
        }
       });
     }
    }).catch(err => {
        console.log('Error creating the PIN or sending mail! ' + err)
    });

    return 1;
}

// resend verify token
const resend_token = (req, res) => {
    var check = password_resets.findOne({
        where: {
            email: req.body.email
        }
    }).then(data => {
        if (data === null){
            throw Error("User doesn't exist!!"); 
        }
       const pin =  Math.floor(Math.random() * 999999) + 100000;
       password_resets.update({
        token: pin
       },
       { where: { email: req.body.email}}).then(msg =>{
        if (msg === null){
            throw Error("unable to re-create a verification pin");
        }
        else{
            eventEmitter.emit('sendVerifyAccount', pin,req.body.email);
            res.status(200).json({'message' : 'Verification token has been re-sent to your email!', 
    'status':1}); 
        }
       });
    }).catch(err => {
        res.status(400).json({'message' : 'Error re-creating the PIN or sending mail! '+err, 
        'status':0}); 
    });

    return 1;
    
}

// verify new user
const verifyMail = (req, res) => {
    password_resets.findOne({
        where: {
            email: req.body.email,
            token: req.body.pin
        }
    }).then(resp => {
        if(resp === null || resp === ''){
            throw Error('Invalid token!');
        }

        // after successful validation, remove the user's verification token and 
        // continue to proccess the request. This means user has been verified.
        password_resets.destroy({
            where: {
                email: req.body.email,
                token: req.body.pin
            } 
        }).then(deleted =>{
         if(!deleted){
            throw Error("Error deleting the user token!!");
         }
        });

        // go to user's table and update the verification time-stamp. User is now verified successfully
        var date = new Date();
        var dateStr =
   date.getFullYear() + "-" +
 ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
  ("00" + date.getDate()).slice(-2) +" "+
  
  ("00" + date.getHours()).slice(-2) + ":" +
  ("00" + date.getMinutes()).slice(-2) + ":" +
  ("00" + date.getSeconds()).slice(-2);
        
        users.update(
            {  
                verifiedAt: dateStr
             }, 
            { where: { email: req.body.email}}
        )
    }).then(done => {
        /*if(!done){
            throw Error("Error updating the user with a verified token!!");
         }*/

         res.status(200).json({'message' : 'User verified succesfully, you may proceed to login' 
         ,'status':1});
    }).
     catch(err => {
        res.status(403).json({'message' : 'Error updating the user with a verified token or updating the dB! ' + err, 
        'status':0});
     });

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
                        var name = qry.username;
                        var email = qry.email;
                        if(qry.admin === "1"){
                            role = 'admin';
                        }
                        else{
                            role = 'user'; 
                        }
                        const user_details = {username: name, role: role };

                        new_user_verify(email);
                        if(!new_user_verify){
                            res.status(403).json({'message' : 'Error initiatiating a verification token for the new user', 
                                          'status':0});
                        }
                        
                        // assign token to new user
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
                users.update(
                    {  firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        password: hash,
                        age: req.body.age 
                     }, 
                    { where: { username: username}}
                );
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
    let show = cache.get('jwt_token_dreywandowski');
   // res.json(show);
   res.json( 'user == '+JSON.stringify(req.user) + ' and keys ---'+JSON.stringify(cache.keys()));
  
}




module.exports = {
    index,
    register,
    login,
    logout,
    editProfile,
    verify,
    verifyMail,
    resend_token

}