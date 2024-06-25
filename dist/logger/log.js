"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const customLevels = {
    levels: {
        info: 0,
        ok: 1,
        error: 2
    },
    colors: {
        info: 'blue',
        ok: 'green',
        error: 'red'
    }
};
const logger = winston_1.default.createLogger({
    levels: customLevels.levels,
    format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.timestamp(), winston_1.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [
        new winston_1.transports.Console({ level: 'info', format: winston_1.format.simple() }),
        new winston_1.transports.File({ filename: 'logfile.log', level: 'info' })
    ]
});
winston_1.default.addColors(customLevels.colors);
const customLogger = {
    ...logger,
    info: (message) => logger.log('info', message),
    ok: (message) => logger.log('ok', message),
    error: (message) => logger.log('error', message)
};
exports.default = logger;
//# sourceMappingURL=log.js.map