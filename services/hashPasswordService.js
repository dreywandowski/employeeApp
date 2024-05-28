const bcrypt = require("bcrypt");

function hashPassword(plaintextPassword) {
    bcrypt.hash(plaintextPassword, 15)
        .then(hash => {
            console.log("our hashed pwd: "+hash);
            return hash;
        }).catch(err => {
            throw new Error("Error hashing the password " + err); 
        });
    }
    

    function decryptPassword(pwd, dbPwd) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pwd, dbPwd)
            .then(plain => {
                resolve(plain);
            }).catch(err => {
                reject(' Username and password do not match '+ err); 
            });
        });
        }

    module.exports = {
        hashPassword,
        decryptPassword
      }