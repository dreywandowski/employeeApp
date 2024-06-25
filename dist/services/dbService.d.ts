declare const raw_log: any;
declare const logger: any;
declare const insertData: (table: any, data: any) => Promise<any>;
declare const getData: (table: any, clause: any, exclude_list: any) => Promise<string>;
declare const updateData: (table: any, attributes: any, clause: any) => Promise<any>;
declare const raw_logs: (title: any, body: any) => Promise<boolean>;
