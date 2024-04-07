const bcrypt = require("bcrypt");

function hashPassword(plaintextPassword) {
    return new Promise((resolve, reject) => {
    bcrypt.hash(plaintextPassword, 15)
        .then(hash => {
            console.log("our hashed pwd: "+hash);
            resolve(hash);
        }).catch(err => {
            reject('Error hashing the password '+ err); 
        });
    });
    }

    module.exports = {
        hashPassword
      }