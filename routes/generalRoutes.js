var express = require('express');
var app = express();
var router = express.Router();
var jobs = require('../controllers/JobsController');
var applications = require('../controllers/ApplicationsController');
var salary = require('../controllers/SalaryController');
const axios = require('axios');


// handle POST requests
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended :false});


  // callback route for transfer
  router.get('/transferCallback', salary.transfersCallback);

  // get all jobs
  router.get('/jobs', jobs.getJobs);

  // get job
  router.get('/jobs/:id', jobs.getJob);

  // apply for job
  router.post('/jobs/applications/apply', urlencodedParser, applications.apply);

  router.get('/get_numbers', async (req, res) => {
    try {
      const token = 'FLWSECK_TEST-bb2254afd109eb2d835b4b36a3f195fe-X';
      const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
        
        const response = await axios.get('https://api.flutterwave.com/v3/banks/NG', config);

        // Extract the data from the response
        const data = response.data;

        // Send the data as the response
        res.status(200).send(data);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).send(error);
    }
});

module.exports = router;