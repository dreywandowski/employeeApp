var users = require('../models/Users');
var password_resets = require('../models/password_resets');
const { hashPassword, decryptPassword } = require('../services/hashPasswordService'); 
const { insertData, getData, updateData } = require('../services/dbService'); 
const { getResource, postResource} = require('../services/curlService');
const { emitEvent } = require('../services/emailService');
const bank_acct = require('../models/bank');
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 86450 });


   // home route
const index = (req, res, next) => {
    res.status(200).json({'message' : 'The API is up and running on port 5000', 
    'status':'Unauthenticated'}); 
}

const d = new Date();
d.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
const newD = new Date(d.getTime() + 172800);


// assign new user token utility
async function assignUserToken(username, role, email) {
    try {
        // Sign JWT token with user id
        var token = jwt.sign({
            user: username,
            role: role,
            email: email
        }, process.env.JWT_KEY, {
            expiresIn: 86400
        });

        // Save tokens to the database against the user
        const upd = await updateData(users, { jwt: token }, { username: username });

        // Save token to a cache for fast retrieval
        let exists = cache.has('jwt_token_' + username);
        obj = { k: username, val: token };

        if (!exists) {
            cache.set('jwt_token_' + username, obj, 86400); 
        } else {
            cache.del('jwt_token_' + username);
            cache.set('jwt_token_' + username, obj, 86400);
        }

        return token;
    } catch (error) {
        throw new Error('Error assigning token: ' + error.message);
    }
}


// new user verification initiation
async function new_user_verify(email){
    try{
    const check = await getData(password_resets, {
        email: email
});
     if(Object.keys(check).length !== 0){
        return 0;
     }
     else{
       const pin =  Math.floor(Math.random() * 999999) + 100000;
       await insertData(password_resets, {email: email, token: pin });
       await emitEvent('sendVerifyAccount', pin, email,  process.env.USER_VERIFY_TEMPLATE, "Verify your account");
       return 1;
        }
     }
catch{
    reject('Error hashing the password');
}
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
            emitEvent('sendVerifyAccount', pin, pin,req.body.email,  process.env.USER_VERIFY_TEMPLATE, "Verify your account");
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
async function register (req, res) {
    try{
       var qry = req.body;

         // hash the password
    const hashed = await hashPassword(qry.password);

    // save the user 
    const saveUser = await insertData(Users, { firstName: qry.firstName,
        username: qry.username,
        lastName: qry.lastName,
        password: hashed,
        age: qry.age,
        email:qry.email,
        department: qry.dept,
        isAdmin: qry.admin});

  // send verification mail
   const ver =  await new_user_verify(qry.email);
        if(!ver){
            throw new Error('Error initiatiating a verification token for the new user! User already exists'); 
        }

        // create and assign token to new user
     qry.admin === "1" ? role = 'admin' : role = 'user';
   const user_details = {username: qry.username, role: role, email:qry.email };
   const assignToken = await assignUserToken(qry.username, role, qry.email);

   // create bank acct for user after all is done
   let payload = {
    "email": qry.email,
    'is_permanent' : true,
    "tx_ref": "flw_"+new Date(),
    "firstname": qry.firstName,
    "lastname": qry.lastName,
    "phonenumber": qry.phoneNumber,
    "bvn": "12345678901",
    "narration": "my account details"
  };
 const bankDetails = await postResource(payload,'/virtual-account-numbers');
 if(bankDetails.status == 'success' && bankDetails.data.response_code == '02'){
    await insertData(bank_acct, { accountName: qry.firstName + ' ' + qry.lastName,
    accountNumber: bankDetails.data.account_number,
    bankName: bankDetails.data.bank_name,
    username: qry.username});
 }
  
   res.status(201).json({'message' : 'User '+qry.firstName+ ' '+ qry.lastName+' '+ 'created sucessfully!',
   accessToken:assignToken, user: user_details,expiresAt: newD, 'status':1});
   
            }
        catch(error){
            let statusCode = 403; // Default status code
            if (error.message.includes('Error creating the records' || 'Error assigning token')) {
                statusCode = 500;
            }
            res.status(statusCode).json({
                message: error.message,
                status: 0
            });
        }
        
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
async function login(req, res){
    try{
    var qry = req.body;
    const username = qry.username;
    const pwd  = qry.password;
    const check = await getData(users, {username: username});

    check[0].dataValues.isAdmin ? role = 'admin' : role = 'user';
    const user_details = {username: username, role: role, email:check[0].dataValues.email };
  
    const checkPwd = await decryptPassword(pwd,check[0].dataValues.password);
    if(checkPwd){
        const assignToken = await assignUserToken(qry.username, role, check[0].dataValues.email);
        res.status(200).json({'message' :'Login successful.., Authenticated!', 'status' :1, accessToken:assignToken, user: user_details,expiresAt: newD});
    }
    else{
        res.status(500).json({'message' : 'Username or password dont match!', 'status': 0})
    }
    }
        catch(err){
            throw new Error('Error logging in : ' + err.message);
        };
    }

// logout
async function logout(req, res){
    try{
      await updateData(users, { jwt: null }, { username: req.user.user});
        res.status(200).json({'message' :'Logout successful, Unauthenticated!', 'status' :1});
      }
      catch(e) {
        res.status(500).json({'message' : ' Error logging out the user, kindly check the error msg!',
        'error': err.message, 'status': 0});
      }

       
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