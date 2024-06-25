import { Router } from 'express';
import { deleteEmployee, employee_id, getEmployees, rankEmployee } from '../controllers/AdminController';
import { getApplication, getApplications } from '../controllers/ApplicationsController';
import { closeJob, postJob } from '../controllers/JobsController';
//import leave from '../controllers/LeaveController';
//import salary from '../controllers/SalaryController';
import verification from '../middleware/checkUserVerified';
import adminVerify from '../middleware/verifyAdmin';
import auth from '../middleware/verifyToken';


const router: Router = Router();

// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/////////////// EMPLOYEE ROUTES //////////////////////
// delete employee
router.delete('/employees/removeEmployee/:name', [auth, verification, adminVerify], deleteEmployee);

// assign employees to appropriate supervisor
//router.post('/employees/assignSupervisor/:name', [auth, verification, adminVerify], assignEmployee);

// get employee
router.get('/employees/:name', [auth, verification, adminVerify], employee_id);

// get employees
router.get('/employees/', [auth, verification, adminVerify], getEmployees);




// rank employee for salary grade purposes
router.post('/employees/rankEmployee/:name', [auth, verification, adminVerify, urlencodedParser], rankEmployee);

// create bank account
// router.post('/employees/createAccount', [auth, verification, adminVerify, urlencodedParser], salary.addAccount);

// transfer money
//router.post('/employees/paySalary', [auth, verification, adminVerify, urlencodedParser], salary.paySalary);

// transfer money -- bulk
// router.post('/employees/admin/transferBulk', [auth, verification, adminVerify, urlencodedParser], salary.transferMoneyFlw);


// list banks
//router.get('/banks', [auth, verification, adminVerify], salary.listBanks);

////////////////////////////////////////////////////////////////



/////////////// LEAVE ROUTES //////////////////////
// get a list of leaves needing admin attention
//router.get('/leaves/attention', [auth, verification, adminVerify], leave.getLeavesApproval);

// approve a leave request
//router.post('/leaves/approve/:id', [auth, verification, adminVerify], leave.approveLeave);

// reject a leave request
//router.post('/leaves/reject/:id', [auth, verification, adminVerify], leave.rejectLeave);

////////////////////////////////////////////////////////////////


/////////////// JOB ROUTES //////////////////////

// view job application
router.get('/jobs/applications/:id', [auth, verification, adminVerify], getApplication);

// view job applications
router.get('/jobs/applications', [auth, verification, adminVerify, urlencodedParser], getApplications);

// create job application
router.post('/jobs/applications', [auth, urlencodedParser, verification, adminVerify], postJob);

// change application status
//router.post('/jobs/applications/changeAppStatus', [auth, urlencodedParser, verification, adminVerify], applications.changeJobStatus);

// close job
router.post('/jobs/applications/closeJob', [auth, urlencodedParser, verification, adminVerify], closeJob);

////////////////////////////////////////////////////////////////


export default router;