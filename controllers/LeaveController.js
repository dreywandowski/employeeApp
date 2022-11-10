var leave = require('../models/leave');

// get all leaves
const getLeaves = (req, res) => {
    let username = req.user.user;
        return leave.findAll({
            where: {
                username: username
            }
            //attributes: { exclude: ['password', 'createdAt'] }
    }). then(leave =>{
                res.status(200).json({'message' : 'Leave list retrieved sucessfully!', 
                'leaves': leave, 'status': 1});
            }).
        catch(err =>{
            res.status(404).json({'message' : 'Error Retrieving leave list!', 
            'error': err, 'status': 0});
        });

}


// create a leave request 
const createLeave = (req, res) => {
    let username = req.body.username;     let purpose = req.body.purpose;
    let type = req.body.type;             let status = req.body.status;
    let date_from = req.body.date_from;   let date_to = req.body.date_to;
     
    leave.create({
        username: username,
        purpose: purpose,
        type: type,
        status: status,
        date_from: date_from,
        date_to: date_to
    }).then(leave => {
        res.status(201).json({'message' : 'Leave request created sucessfully!', 
                          'status':1});
    }).catch(err =>{
        console.log('nooooo' + err);
        res.status(403).json({'message' : 'Error creating the leave application! ' + err, 
                          'status':0});
    });
}





module.exports = {
    getLeaves,
    createLeave  
}
