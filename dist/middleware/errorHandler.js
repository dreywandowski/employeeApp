module.exports = (req, res, next) => {
    User.findOne({
        where: {
            username: req.user.user
        },
        attributes: ['verifiedAt'],
    }).then(resp => {
        if (resp.verifiedAt === null) {
            throw Error("user is not yet verified!!");
        }
        next();
    }).catch(e => {
        return res.status(400).json({ error: "unable to authenticate user! " + e, status: 0 });
    });
};
//# sourceMappingURL=errorHandler.js.map