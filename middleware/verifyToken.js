const jwt = require("jsonwebtoken");
User = require("../models/Users");

module.exports = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 

  if (!token) {
     return res.status(401).json({ error: 'token missing', status : 0 })
  }

  try {
    // decode the JWT token and pass on the user details on to the request for the route that will call it
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).json({ error: 'token invalid '+e, status : 0 })
  }
};
