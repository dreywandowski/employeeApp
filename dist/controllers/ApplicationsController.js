"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplication = exports.getApplications = void 0;
exports.apply = apply;
var application = require('../models/application');
var job = require('../models/job');
const { emitEvent } = require('../services/eventService');
var Json2csvParser = require('json2csv').Parser;
const { insertData, getData, updateData } = require('../services/dbService');
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
const getApplications = (req, res) => {
    return application.findAll().then(applications => {
        if (req.body.csv == 1) {
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
};
exports.getApplications = getApplications;
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
};
exports.getApplication = getApplication;
//# sourceMappingURL=ApplicationsController.js.map