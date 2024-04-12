const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

     async function sendMail(emailBody) {
      // Create a Nodemailer transporter
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
    
      // Create email message
      const mailOptions = {
        from: 'admin@employeeapp.com',
        to: emailBody.recipient,
        bcc: emailBody.cc,
        subject: emailBody.subject,
        html: emailBody.content,
        attachments: emailBody.attachment != '' ? [
          {
            content: Buffer.from(emailBody.attachment.content, 'base64'),
            filename: emailBody.attachment.filename,
            encoding: emailBody.attachment.encoding,
          },
        ] : [],
      };
    
      try {
        // Send the email
        const info = await transport.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
       // return 'sent';
      } catch (error) {
        console.error('Error sending email:', error.message);
        return `Mailer Error: ${error.message}`;
      }
    }

module.exports = {
    sendMail,
}

