const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { convertAndSend } = require('./pdfService');
const logger = require('../logger/log');
async function emitEvent(event_, info) {
    try {
        eventEmitter.on(event_, async (info) => {
            try {
                switch (event_) {
                    case "sendMail":
                        await convertAndSend(info);
                        break;
                    default:
                }
            }
            catch (err) {
                logger.error(`${new Date().toISOString()} : Error firing event: `, err);
                throw new Error("Error firing event: " + err);
            }
        });
        eventEmitter.emit(event_, info);
    }
    catch (err) {
        logger.error(`${new Date().toISOString()} : Unable to fire event: `, err);
        throw new Error("Unable to fire event: " + err);
    }
}
module.exports = {
    emitEvent
};
//# sourceMappingURL=eventService.js.map