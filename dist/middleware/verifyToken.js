"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const Users_1 = require("../models/Users");
const auth = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'token missing', status: 0 });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        Users_1.default.findOne({
            where: {
                username: req.user.user,
                jwt: token
            },
            attributes: ['jwt'],
        }).then(resp => {
            if (resp === null) {
                throw Error("Token doesn't exist!!!");
            }
            next();
        }).catch(e => {
            return res.status(400).json({ error: 'unable to validate token... ' + e, status: 0 });
        });
    }
    catch (e) {
        return res.status(400).json({ error: 'token invalid ' + e, status: 0 });
    }
};
exports.default = auth;
//# sourceMappingURL=verifyToken.js.map