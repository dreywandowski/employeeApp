import { NextFunction, Response } from 'express';
import jwt from "jsonwebtoken";
import User from "../models/Users";
import { IGetUserAuthInfoRequest } from "../types";

const auth = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

  }

  if (!token) {
    return res.status(401).json({ error: 'token missing', status: 0 })
  }


  try {
    // decode the JWT token and pass on the user details on to the request for the route that will call it
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    // search on the db if authenticated token exists
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
      return res.status(400).json({ error: 'unable to validate token... ' + e, status: 0 })
    });


  } catch (e) {
    return res.status(400).json({ error: 'token invalid ' + e, status: 0 })
  }
};


export default auth;