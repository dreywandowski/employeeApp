var application = require('../models/application');
var job = require('../models/job');
const { sendEmail } = require('../services/emailService');
var Json2csvParser = require('json2csv').Parser;
const EventEmitter = require('events');
var eventEmitter = new EventEmitter();
const { insertData, getData, updateData } = require('../services/dbService'); 

// TO-DO: Block applications for jobs that are expired

// send mail to user upon succesful job application
eventEmitter.on('sendApplyMail', (msg, email) => {
  const contentData = {
    msg: msg
  };
  sendEmail(email, "Your job application has been recieved", contentData, process.env.JOB_APPLIED_TEMPLATE);
});


// send mail to user upon change of job application status
eventEmitter.on('sendFirstInterviewMail', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
sendEmail(email, "Interview Invitation", process.env.INTERVIEW_TEMPLATE, contentData);
});

eventEmitter.on('sendSecondInterviewMail', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
  sendEmail(email, "Final Interview Invitation", process.env.INTERVIEW_TEMPLATE_SECOND, contentData);
  });

eventEmitter.on('sendOfferLetter', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
    sendEmail(email, "Offer Letter", process.env.OFFER_LETTER, contentData);
    });


// apply for a job 
async function apply(req, res){
  try{
    var qry = req.body;
    const jobs = await getData(job, {id: qry.job_id});
    if (Object.keys(jobs).length == 0){
      throw new Error("job doesn't exist!!"); 
   }
      let job_status = jobs.toJSON();
      if (jobs && job_status.isOpen) { 
        const create_job = await insertData(job, {
          firstName: qry.firstName,
         lastName: qry.lastName,
         email: qry.email,
         phone: qry.phone,
         address: qry.address,
         location: qry.location,
         total_years_of_experience: qry.yearsOfExperience,
         skills: qry.skills,
         proffessional_qualifications: qry.proffessional_qualifications,
         jobAppliedFor : qry.jobAppliedFor,
         job_id: qry.job_id
         });

     // send mail to user after a successful application
     eventEmitter.emit('sendApplyMail', qry.jobAppliedFor, qry.email);
     res.status(201).json({'message' : 'Application submitted sucessfully!', 
     'status': 1});
     }
       else {
              throw Error("Job listing has expired");
            }
          }
           catch(err){
       res.status(404).json({'message' : 'Error applying for the job!', 
       'error': err.message, 'status': 0});
   }
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

// change job status 
const changeJobStatus = (req, res) => {
  var qry = req.body;
  var qry_upd = {};
  if(qry.interview_date !== null && qry.interview_date !==''){
    qry_upd = { status: qry.status, interview_date: qry.interview_date };
  }
  else{
     qry_upd = { status: qry.status };
  }
  return application.update(qry_upd, {
    where: {
      id:qry.id
    }
  }).
   then(updated =>{
    // get application details
    return application.findAll({where: {id:qry.id}}).
    then(application =>{
      let email = '';  let jobAppliedFor = '';  let interview_date = '';
      let firstName = '';  let lastName = ''; 

      application.forEach(instance => {
        const dataValues = instance.dataValues;

        firstName = dataValues.firstName;
        lastName = dataValues.lastName;
        email = dataValues.email;
        jobAppliedFor = dataValues.jobAppliedFor;
        interview_date = dataValues.interview_date;
        
    
      });
       if(qry.status == 2){
        eventEmitter.emit('sendFirstInterviewMail', email, interview_date, jobAppliedFor, process.env.COMPANY_ADDRESS);
       }
       else if(qry.status == 3){
        eventEmitter.emit('sendSecondInterviewMail', email, interview_date, jobAppliedFor, process.env.COMPANY_ADDRESS);
       }
       // TO-DO: generate offer letter email + pdf and send
       else if(qry.status == 4){
        eventEmitter.emit('sendOfferLetter', email, interview_date, jobAppliedFor, process.env.COMPANY_ADDRESS);
       }
       else{
       }
         
          res.status(200).json({'message' : 'Application status updated sucessfully!', 'status': 1});
      })
    }).
  catch(err =>{
      res.status(404).json({'message' : 'Error updating application status!', 
      'error': err, 'status': 0});
  });
}

// export applications to csv

module.exports = {
    apply,
    getApplication,
    getApplications,
    changeJobStatus
    
}