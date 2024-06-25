"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../models/Users");
const verification = (req, res, next) => {
    Users_1.default.findOne({
        where: {
            username: req.user.user
        },
        attributes: ['verifiedAt'],
    }).then((resp) => {
        if (resp.verifiedAt === null) {
            throw Error("user is not yet verified!!");
        }
        next();
    }).catch(e => {
        return res.status(400).json({ error: "unable to authenticate user! " + e, status: 0 });
    });
};
exports.default = verification;
//# sourceMappingURL=checkUserVerified.js.map