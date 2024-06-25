"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeJob = exports.postJob = exports.getJob = exports.getJobs = void 0;
var jobs = require('../models/job');
const getJobs = (req, res) => {
    return jobs.findAll({}).then(jobs => {
        res.status(200).json({
            'message': 'Job list retrieved sucessfully!',
            'jobs': jobs, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving job list!',
            'error': err, 'status': 0
        });
    });
};
exports.getJobs = getJobs;
const getJob = (req, res) => {
    let id = req.params.id;
    return jobs.findAll({ where: { id: id } }).
        then(job => {
        res.status(200).json({
            'message': 'Job item retrieved sucessfully!',
            'job': job, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving leave!',
            'error': err, 'status': 0
        });
    });
};
exports.getJob = getJob;
const postJob = (req, res) => {
    var qry = req.body;
    var title = qry.title;
    return jobs.create({
        title: qry.title,
        isOpen: qry.isOpen,
        yearsOfExperience: qry.yearsOfExperience,
        description: qry.description,
        duties: qry.duties,
        qualifications: qry.qualifications,
        skills: qry.skills,
        end_date: qry.end_date,
        department: qry.department
    }).then(created => {
        res.status(201).json({
            'message': 'Job ' + title + ' created sucessfully!',
            'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error creating the job!',
            'error': err, 'status': 0
        });
    });
};
exports.postJob = postJob;
const closeJob = (req, res) => {
    var qry = req.body;
    return jobs.update({ isOpen: 0 }, {
        where: {
            id: qry.id
        }
    }).
        then(updated => {
        res.status(200).json({ 'message': 'Job status updated sucessfully!', 'status': 1 });
    }).
        catch(err => {
        res.status(403).json({
            'message': 'Error updating Job status!',
            'error': err, 'status': 0
        });
    });
};
exports.closeJob = closeJob;
//# sourceMappingURL=JobsController.js.map