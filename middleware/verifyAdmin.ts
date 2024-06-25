// verify user if its admin
import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from "../types";

const adminVerify = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const role = req.user.role;

  if (role === "admin") {
    next()
  }
  else {
    res.status(404).json({
      'message': 'This user is not authorized to use this route!',
      'status': 0
    });
  }


};

export default adminVerify;
