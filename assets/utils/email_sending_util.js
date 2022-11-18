var EventEmitterUtil = require('events');
const nodemailer = require('nodemailer');
const ejs = require('ejs');



var eventEmitter = new EventEmitterUtil();
console.log('here in thecvr util function!!'  + "and ....." );

// send mail to user upon succesful job application
eventEmitter.on('sendMail', (msg, email) => {
  console.log('here in the email util function!!' + msg + "and ....." + email);
    const sendEmail = (receiver, subject, content) => {
         user = process.env.MAIL_USERNAME;
         pass = process.env.MAIL_PWD;

        let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: user,
          pass: pass
        }
     });
     ejs.renderFile('/var/www/html/payroll/assets/templates/job_application_template.ejs', {content:msg}, (err, data) => {
        if (err) {
          console.log("error opening the file!! "+err);
        } else {
          var mailOptions = {
            from: 'admin@employee-app.com',
            to: email,
            subject: subject,
            html: data
          };
        }
   
   transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log("cant send mail!! " + err);
       } else {
         console.log("mail sent ok "+"content=="+ msg+info);
       }
   });
});
}
        sendEmail("aduramimo@gmail.com", "Your job application has been recieved");
 });



 module.exports = {
    eventEmitter
 };