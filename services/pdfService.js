const fs = require('fs').promises;
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const logger = require('../logger/log');
const { sendMail } = require('../services/emailService');

async function convertAndSend(jsonData, printPdf = false) {
  try {
    let attachment = '';
    if(printPdf){
        const pdfFileName = `${full_name.replace(/\s+/g, '_')}_offer_letter.pdf`;
        const pdfFullPath = `./pdfs/${pdfFileName}`;
        const pdfContent = await ejs.renderFile(process.env.PDF_TEMPLATE, { jsonData });

          // Create PDF from HTML content using Puppeteer
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(pdfContent);
        await page.pdf({ path: pdfFullPath, format: 'ledger', scale: 1, protrait: true });
        await browser.close();

        // Read the created PDF file
       // console.log('full path' + pdfFullPath);
       const data = await fs.readFile(pdfFullPath);

      // Convert the file data to a Base64 string
      pdfEncoded = data.toString('base64');
      //console.log('Base64 string:', pdfEncoded);

      // Prepare email content and attachment
      attachment = {
        filename: `${full_name} - ${file_name}.pdf`,
        content: pdfEncoded,
        encoding: 'base64',
        contentType: 'application/pdf',
      };
    }

    // Render E-mail HTML from EJS template
    const mailContent = await ejs.renderFile(jsonData.template);
    try { 
      const emailBody = {
        recipient: jsonData.email,
        subject: jsonData.subject,
        cc: ['aduramimo@gmail.com'],
        content: mailContent,
        attachment: attachment ? attachment : '',
      };

      // Send email
      const send_mail = await sendMail(emailBody);
      logger.info('Email sent successfully:', send_mail);
      
      if(printPdf){
      // Delete the file after sending the email
       await fs.unlink(pdfFullPath);
       logger.info('File deleted successfully:', pdfFullPath);
      }
    } catch (error) {
      logger.error('Error:', error);
      console.error('Error:', error);
    }
  } catch (err) {
    logger.error('Error:', err);
    console.error('Error:', err);
  }
}

module.exports = {
  convertAndSend
};
