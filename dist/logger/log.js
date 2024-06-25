const winston = require('winston');
const logger = winston.createLogger({
    levels: {
        'info': 0,
        'ok': 1,
        'error': 2
    },
    format: winston.format.combine(winston.format.simple(), winston.format.timestamp(), winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [
        new winston.transports.Console({ level: 'info', format: winston.format.simple(), colorize: true }),
        new winston.transports.File({ filename: 'logfile.log', level: 'info' })
    ]
});
logger.info = (message) => logger.log('info', message);
logger.ok = (message) => logger.log('ok', message);
logger.error = (message) => logger.log('error', message);
module.exports = logger;
//# sourceMappingURL=log.js.map