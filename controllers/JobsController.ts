var jobs = require('../models/job');
import { Request, Response } from 'express';

// get all jobs
export const getJobs = (req: Request, res: Response) => {
    return jobs.findAll({
        //attributes: { exclude: ['password', 'createdAt'] }
    }).then(jobs => {
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

}

// get a job item
export const getJob = (req: Request, res: Response) => {
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
}

// post a job 
export const postJob = (req: Request, res: Response) => {
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

}

export const closeJob = (req: Request, res: Response) => {
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
}


