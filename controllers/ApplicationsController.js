var application = require('../models/application');

// apply for a job 
const apply = (req, res) => {
    var qry = req.body;
    return application.create({
        firstName: qry.firstName,
       lastName: qry.lastName,
       email: qry.email,
       phone: qry.phone,
       address: qry.address,
       location: qry.location,
       total_years_of_experience: qry.yearsOfExperience,
       skills: qry.skills,
       proffessional_qualifications: qry.proffessional_qualifications,
       jobAppliedFor : qry.jobAppliedFor
     
   }).then(created => {
       res.status(201).json({'message' : 'Application submitted sucessfully!', 
               'status': 1});
   }).
   catch(err =>{
       res.status(404).json({'message' : 'Error applying for the job!', 
       'error': err, 'status': 0});
   });
}

// view applications
const getApplications = (req, res) => {
    return application.findAll(). then(applications =>{
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
            res.status(404).json({'message' : 'Error Retrieving leave!', 
            'error': err, 'status': 0});
        });
}


// export applications to csv

module.exports = {
    apply,
    getApplication,
    getApplications
    
}