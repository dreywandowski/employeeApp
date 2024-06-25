import winston, { format, transports } from 'winston';

// Define custom logging levels
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

// Create the logger instance
const logger = winston.createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({ level: 'info', format: format.simple() }),
        new transports.File({ filename: 'logfile.log', level: 'info' })
    ]
});

// Apply the colors to the levels
winston.addColors(customLevels.colors);

// Add custom log methods
const customLogger = {
    ...logger,
    info: (message: string) => logger.log('info', message),
    ok: (message: string) => logger.log('ok', message),
    error: (message: string) => logger.log('error', message)
};


export default logger;
