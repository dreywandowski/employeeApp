const EventEmitter = require('events');
var eventEmitter = new EventEmitter();
const { sendMail } = require('../services/emailService');
const { convertAndSend } = require('./pdfService');

async function emitEvent(event_, info){
    try{
      eventEmitter.on(event_, async (info) => {
        try {
            switch(event_){
             case  "sendMail":
                await convertAndSend(info);
            break;
            default:
            }
          
        } catch (err) {
          throw new Error("Error firing event: " + err);
        }
      });
      eventEmitter.emit(event_, info);
    }
    catch(err){
      throw new Error("Unable to fire event: " + err);
    }
  }

  module.exports = {
    emitEvent
}