const fs = require('fs').promises;
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const logger = require('../logger/log');
const { sendMail } = require('../services/emailService');
async function convertAndSend(jsonData) {
    try {
        let attachment = '';
        let pdfFullPath = '';
        if (jsonData.printPdf) {
            const pdfFileName = `${jsonData.fullName.replace(/\s+/g, '_')}_${jsonData.pdfType.replace(/\s+/g, '_')}.pdf`;
            pdfFullPath = `./pdfs/${pdfFileName}`;
            const pdfContent = await ejs.renderFile(jsonData.pdfTemplate, { jsonData });
            const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(pdfContent);
            await page.pdf({ path: pdfFullPath, format: 'A4', scale: 0.8, portrait: true });
            await browser.close();
            const data = await fs.readFile(pdfFullPath);
            pdfEncoded = data.toString('base64');
            attachment = {
                filename: `${pdfFileName}`,
                content: pdfEncoded,
                encoding: 'base64',
                contentType: 'application/pdf',
            };
        }
        const mailContent = await ejs.renderFile(jsonData.template, { jsonData });
        try {
            const emailBody = {
                recipient: jsonData.email,
                subject: jsonData.subject,
                cc: ['aduramimo@gmail.com'],
                content: mailContent,
                attachment: attachment ? attachment : '',
            };
            const send_mail = await sendMail(emailBody);
            logger.info('Email sent successfully:', send_mail);
            if (jsonData.printPdf) {
                await fs.unlink(pdfFullPath);
                logger.info('File deleted successfully:', pdfFullPath);
            }
        }
        catch (error) {
            logger.error('Error:', error);
            console.error('Error:', error);
        }
    }
    catch (err) {
        logger.error('Error:', err);
        console.error('Error:', err);
    }
}
module.exports = {
    convertAndSend
};
//# sourceMappingURL=pdfService.js.map