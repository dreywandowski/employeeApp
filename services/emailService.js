const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const EventEmitter = require('events');
var eventEmitter = new EventEmitter();


async function emitEvent(event_, content, email, template, subject){
  try{
    eventEmitter.on(event_, async (content, email, template, subject) => {
      try {
        await sendEmail(email, subject, content, template);
      } catch (err) {
        throw new Error("Error sending email: " + err);
      }
    });
    eventEmitter.emit(event_, content, email, template, subject);
  }
  catch(err){
    throw new Error("Unable to fire event: " + err);
  }
}


    async function sendEmail(email, subject, others, template){
         user = process.env.MAIL_USERNAME;
         pass = process.env.MAIL_PWD;
         let content = '';

        let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user,
          pass
        }
     });
     ejs.renderFile(template, {content:others}, (err, data) => {
        if (err) {
          console.log("error opening the file!! "+err);
        } else {
          var mailOptions = {
            from: 'admin@employeeapp.com',
            to: email,
            bcc: emailBody.cc,
            subject: subject,
            html: data,
            attachments: [
              {
                content: Buffer.from(emailBody.attachment.content, 'base64'),
                filename: emailBody.attachment.filename,
                encoding: emailBody.attachment.encoding,
              },
            ],
          };
        }
   
        try {
          // Send the email
          const info = await transporter.sendMail(mailOptions);
          console.log('Message sent: %s', info.messageId);
         // return 'sent';
        } catch (error) {
          console.error('Error sending email:', error.message);
          return `Mailer Error: ${error.message}`;
        }
     }
     );


module.exports = {
    sendEmail,
    emitEvent
}

