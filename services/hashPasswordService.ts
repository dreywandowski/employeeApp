import bcrypt from "bcrypt";

const hashPassword = async (plaintextPassword) => {
    try {
        let hash = await bcrypt.hash(plaintextPassword, 15);
        console.log("our hashed pwd: " + hash);
        return hash;
    }
    catch (err) {
        throw new Error("Error hashing the password " + err);
    }
}

// turning an ordinary function to asynchronous
function decryptPassword(pwd, dbPwd) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pwd, dbPwd)
            .then(plain => {
                resolve(plain);
            }).catch(err => {
                reject(' Username and password do not match ' + err);
            });
    });
}

module.exports = {
    hashPassword,
    decryptPassword
}