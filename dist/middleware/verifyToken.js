const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const NodeCache = require('node-cache');
module.exports = (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'token missing', status: 0 });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        User.findOne({
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
//# sourceMappingURL=verifyToken.js.map