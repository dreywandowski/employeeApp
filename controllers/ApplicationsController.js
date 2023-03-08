var application = require('../models/application');
const EventEmitter = require('events');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
var Json2csvParser = require('json2csv').Parser;
//var localEvents = require('../assets/utils/email_sending_util');
//var localEvents = new EventEmitter();


var eventEmitter = new EventEmitter();

// send mail to user upon succesful job application
eventEmitter.on('sendMail', (msg, email) => {
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
         console.log("mail sent ok "+"content== "+ msg+info);
       }
   });
});
}
        sendEmail("aduramimo@gmail.com", "Your job application has been recieved");
 });


// apply for a job 
const apply = (req, res) => {
    var qry = req.body;
    var jobAppliedFor = qry.jobAppliedFor;

    return application.create({
        firstName: qry.firstName,
       lastName: qry.lastName,
       email: qry.email,
       phone: qry.phone,
       address: qry.address,
       location: qry.location,
       total_years_of_experience: qry.yearsOfExperience,
       skills: qry.skills,
       proffessional_qualifications: qry.proffessional_qualifications,
       jobAppliedFor : qry.jobAppliedFor
     
   }).then(created => {
    // send mail to user after a successful application
       eventEmitter.emit('sendMail', qry.jobAppliedFor, qry.email);
       //localEvents.emit('sendMail', qry.jobAppliedFor, qry.email);
       res.status(201).json({'message' : 'Application submitted sucessfully!', 
               'status': 1});
   }).
   catch(err =>{
       res.status(404).json({'message' : 'Error applying for the job!', 
       'error': err, 'status': 0});
   });
}

// view applications
const getApplications = (req, res) => {
    return application.findAll().then(applications =>{
      //  option to convert to csv file
            if(req.body.csv == 1){
             // -> Convert JSON to CSV data
       const csvFields = ['id', 'firstName','lastName', 'email', 'phone', 'address', 'location', 'skills', 'total_exp', 'qualifications', 'jobApplied', 'date'];
       const json2csvParser = new Json2csvParser({ csvFields });
       const csv = json2csvParser.parse(applications);

      console.log(csv);
 
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=.downloads/applications.csv");

    res.status(200).end(csv);
            }
             
            res.status(200).json({'message' : 'Application list retrieved sucessfully!', 
            'applications': applications, 'status': 1});
        }).
    catch(err =>{
        res.status(404).json({'message' : 'Error Retrieving applications list!', 
        'error': err, 'status': 0});
    });

}

// view application
const getApplication = (req, res) => {
    let id = req.params.id;
        return application.findAll({where: {id:id}}).
         then(application =>{
                res.status(200).json({'message' : 'Application item retrieved sucessfully!', 
                'application': application, 'status': 1});
            }).
        catch(err =>{
            res.status(404).json({'message' : 'Error Retrieving application!', 
            'error': err, 'status': 0});
        });
}


// export applications to csv

module.exports = {
    apply,
    getApplication,
    getApplications
    
}