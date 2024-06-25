import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from "../types";
declare const auth: (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default auth;
