"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const hashPassword = async (plaintextPassword) => {
    try {
        let hash = await bcrypt_1.default.hash(plaintextPassword, 15);
        console.log("our hashed pwd: " + hash);
        return hash;
    }
    catch (err) {
        throw new Error("Error hashing the password " + err);
    }
};
function decryptPassword(pwd, dbPwd) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(pwd, dbPwd)
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
};
//# sourceMappingURL=hashPasswordService.js.map