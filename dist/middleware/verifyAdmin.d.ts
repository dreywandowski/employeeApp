import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from "../types";
declare const adminVerify: (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => void;
export default adminVerify;
