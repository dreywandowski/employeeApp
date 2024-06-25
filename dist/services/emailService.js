const nodemailer = require('nodemailer');
const logger = require('../logger/log');
async function sendMail(emailBody) {
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
        const info = await transport.sendMail(mailOptions);
        logger.info(`${new Date().toISOString()} : Message sent: ` % s, info.messageId);
    }
    catch (error) {
        logger.error(`${new Date().toISOString()} : Mailer Error: `, error.message);
    }
}
module.exports = {
    sendMail,
};
//# sourceMappingURL=emailService.js.map