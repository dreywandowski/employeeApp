var application = require('../models/application');
var job = require('../models/job');
const { emitEvent } = require('../services/eventService');
var Json2csvParser = require('json2csv').Parser;
const { insertData, getData, updateData } = require('../services/dbService');


// apply for a job 
async function apply(req, res) {
  try {
    var qry = req.body;
    const jobs = await getData(job, { id: qry.job_id });
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
        jobAppliedFor: qry.jobAppliedFor,
        job_id: qry.job_id
      });

      const contentData = {
        job: qry.jobAppliedFor,
        email: qry.email,
        template: process.env.JOB_APPLIED_TEMPLATE,
        subject: "Your job application has been recieved",
      };

      // send mail to user after a successful application
      await emitEvent('sendMail', contentData);
      res.status(201).json({
        'message': 'Application submitted sucessfully!',
        'status': 1
      });
    }
    else {
      throw Error("Job listing has expired");
    }
  }
  catch (err) {
    res.status(404).json({
      'message': 'Error applying for the job!',
      'error': err.message, 'status': 0
    });
  }
}

// view applications
const getApplications = (req, res) => {
  return application.findAll().then(applications => {
    //  option to convert to csv file
    if (req.body.csv == 1) {
      // -> Convert JSON to CSV data
      const csvFields = ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'location', 'skills', 'total_exp', 'qualifications', 'jobApplied', 'date'];
      const json2csvParser = new Json2csvParser({ csvFields });
      const csv = json2csvParser.parse(applications);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=.downloads/applications.csv");

      res.status(200).end(csv);
    }

    res.status(200).json({
      'message': 'Application list retrieved sucessfully!',
      'applications': applications, 'status': 1
    });
  }).
    catch(err => {
      res.status(404).json({
        'message': 'Error Retrieving applications list!',
        'error': err, 'status': 0
      });
    });

}

// view application
const getApplication = (req, res) => {
  let id = req.params.id;
  return application.findAll({ where: { id: id } }).
    then(application => {
      res.status(200).json({
        'message': 'Application item retrieved sucessfully!',
        'application': application, 'status': 1
      });
    }).
    catch(err => {
      res.status(404).json({
        'message': 'Error Retrieving application!',
        'error': err, 'status': 0
      });
    });
}

// change job status 
const changeJobStatus = (req, res) => {
  var qry = req.body;
  var qry_upd = {};
  if (qry.interview_date !== null && qry.interview_date !== '') {
    qry_upd = { status: qry.status, interview_date: qry.interview_date };
  }
  else {
    qry_upd = { status: qry.status };
  }
  return application.update(qry_upd, {
    where: {
      id: qry.id
    }
  }).
    then(updated => {
      // get application details
      return application.findAll({ where: { id: qry.id } }).
        then(application => {
          // TODO: Fill in the Offer Letter proffessionally and start working other modules
          // calculate gross, deductions, net and start date for offer letter
          const contentData = {
            interview_date: application[0].dataValues.interview_date,
            job: application[0].dataValues.jobAppliedFor,
            location: process.env.COMPANY_ADDRESS,
            company: process.env.COMPANY_NAME,
            email: application[0].dataValues.email,
            fullName: application[0].dataValues.firstName + ' ' + application[0].dataValues.lastName,
            template: '',
            subject: '',
            gross: 364383.00,
            deductions: 36374.09,
            net: 253783.09
          };
          switch (qry.status) {
            case "2":
              contentData.template = process.env.INTERVIEW_TEMPLATE;
              contentData.subject = "Interview Invitation";
              emitEvent('sendMail', contentData);
              break;
            case "3":
              contentData.template = process.env.INTERVIEW_TEMPLATE_SECOND;
              contentData.subject = "Final Interview Invitation";
              emitEvent('sendMail', contentData);
              break;
            case "4":
              contentData.template = process.env.OFFER_LETTER;
              contentData.pdfTemplate = process.env.OFFER_PDF_TEMPLATE;
              contentData.subject = "Offer Letter";
              contentData.printPdf = true;
              contentData.pdfType = '_offer_letter';

              emitEvent('sendMail', contentData);
              break;
            default:
          }
          res.status(200).json({ 'message': 'Application status updated sucessfully!', 'status': 1 });
        })
    }).
    catch(err => {
      res.status(404).json({
        'message': 'Error updating application status!',
        'error': err.message, 'status': 0
      });
    });
}

// export applications to csv

module.exports = {
  apply,
  getApplication,
  getApplications,
  changeJobStatus

}