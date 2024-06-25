var express = require('express');
var app = express();
var router = express.Router();
var jobs = require('../controllers/JobsController');
var applications = require('../controllers/ApplicationsController');
var salary = require('../controllers/SalaryController');
const axios = require('axios');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/jobs', jobs.getJobs);
router.get('/jobs/:id', jobs.getJob);
router.post('/jobs/applications/apply', urlencodedParser, applications.apply);
module.exports = router;
//# sourceMappingURL=generalRoutes.js.map