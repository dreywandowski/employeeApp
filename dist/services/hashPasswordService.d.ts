declare const bcrypt: any;
declare const hashPassword: (plaintextPassword: any) => Promise<any>;
declare function decryptPassword(pwd: any, dbPwd: any): Promise<unknown>;
