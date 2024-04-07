const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

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


module.exports = {
    sendEmail 
}

