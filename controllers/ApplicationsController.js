var application = require('../models/application');
var job = require('../models/job');
const { emitEvent } = require('../services/emailService');
var Json2csvParser = require('json2csv').Parser;
const EventEmitter = require('events');
var eventEmitter = new EventEmitter();
const { insertData, getData, updateData } = require('../services/dbService'); 

// send mail to user upon change of job application status
eventEmitter.on('sendFirstInterviewMail', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
sendEmail(email, "Interview Invitation", contentData, process.env.INTERVIEW_TEMPLATE);
});

eventEmitter.on('sendSecondInterviewMail', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
  sendEmail(email, "Final Interview Invitation", contentData, process.env.INTERVIEW_TEMPLATE_SECOND);
  });

eventEmitter.on('sendOfferLetter', (email, interview_date, jobAppliedFor, address) => {
  const contentData = {
    interview_date: interview_date,
    job: jobAppliedFor,
    location: address,
  };
    sendEmail(email, "Offer Letter",  contentData, process.env.OFFER_LETTER);
    });


// apply for a job 
async function apply(req, res){
  try{
    var qry = req.body;
    const jobs = await getData(job, {id: qry.job_id});
    if (Object.keys(jobs).length == 0){
      throw new Error("job doesn't exist!!"); 
   }
      let job_status = jobs[0].dataValues;
      if (jobs && job_status.isOpen) { 
        const create_job = await insertData(application, {
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
     emitEvent('sendApplyMail', qry.jobAppliedFor, qry.email,  process.env.JOB_APPLIED_TEMPLATE, "Your job application has been recieved");
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
       if(qry.status == 2){
        emitEvent('sendFirstInterviewMail', qry.jobAppliedFor, qry.email,  process.env.JOB_APPLIED_TEMPLATE, "Your job application has been recieved");
       // eventEmitter.emit('sendFirstInterviewMail', application[0].dataValues.email, application[0].dataValues.interview_date, application[0].dataValues.jobAppliedFor, process.env.COMPANY_ADDRESS);
       }
       else if(qry.status == 3){
        emitEvent('sendFirstInterviewMail', qry.jobAppliedFor, qry.email,  process.env.JOB_APPLIED_TEMPLATE, "Your job application has been recieved");
        eventEmitter.emit('sendSecondInterviewMail', application[0].dataValues.email, application[0].dataValues.interview_date, application[0].dataValues.jobAppliedFor, process.env.COMPANY_ADDRESS);
       }
       // TO-DO: generate offer letter email + pdf and send
       else if(qry.status == 4){
        emitEvent('sendFirstInterviewMail', qry.jobAppliedFor, qry.email,  process.env.JOB_APPLIED_TEMPLATE, "Your job application has been recieved");
        eventEmitter.emit('sendOfferLetter', application[0].dataValues.email, application[0].dataValues.interview_date, application[0].dataValues.jobAppliedFor, process.env.COMPANY_ADDRESS);
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