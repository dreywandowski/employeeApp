var express = require('express');
var app = express();
var router = express.Router();
var jobs = require('../controllers/JobsController');
var applications = require('../controllers/ApplicationsController');


// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});



 // get all jobs
 router.get('/jobs', jobs.getJobs);

  // get job
  router.get('/jobs/:id', jobs.getJob);

  // apply for job
  router.post('/jobs/applications/apply/:id', urlencodedParser, applications.apply);


module.exports = router;