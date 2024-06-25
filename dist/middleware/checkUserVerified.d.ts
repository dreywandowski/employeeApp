import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from "../types";
declare const verification: (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => void;
export default verification;
