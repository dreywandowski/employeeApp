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

// get a leave item
const getLeave = (req, res) => {
    let username = req.user.user;
    let id = req.params.id;
        return leave.findAll({where: {username: username, id:id}}).
         then(leave =>{
                res.status(200).json({'message' : 'Leave item retrieved sucessfully!', 
                'leaves': leave, 'status': 1});
            }).
        catch(err =>{
            res.status(404).json({'message' : 'Error Retrieving leave!', 
            'error': err, 'status': 0});
        });

}

// create a leave request 
const createLeave = (req, res) => {
    let username = req.user.user;        let purpose = req.body.purpose;
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
        res.status(403).json({'message' : 'Error creating the leave application! ' + err, 
                          'status':0});
    });
}

// make a leave request from an-already created leave 
const requestLeave = (req, res) => {
    leave.update(
        {status: 'requested',}, {where: {
            id: req.params.id}
            /*,
            [Op.not]:[
                {
             status : 'cancelled'
           } 
 ]*/
        })
        .then(leave => {
        res.status(200).json({'message' : 'Leave requested sucessfully!', 
                          'status':1});
    }).catch(err =>{
        res.status(403).json({'message' : 'Error requesting the leave application! ' + err, 
                          'status':0});
    });
}

// cancel a leave request
const cancelLeave = (req, res) => {
    leave.update({status: 'cancelled',}, {where: {id: req.params.id}} ).then(leave => {
        res.status(200).json({'message' : 'Leave request cancelled sucessfully!', 
                          'status':1});
    }).catch(err =>{
        res.status(403).json({'message' : 'Error cancelling the leave application! ' + err, 
                          'status':0});
    });
}

// approve leave request -- admins only
const approveLeave = (req, res) => {
    leave.update({approved: 1,}, {where: {id: req.params.id}} ).then(leave => {
        res.status(200).json({'message' : 'Leave request approved sucessfully!', 
                          'status':1});
    }).catch(err =>{
        res.status(403).json({'message' : 'Error approving the leave application! ' + err, 
                          'status':0});
    });
}

// reject leave request -- admins only

const rejectLeave = (req, res) => {
    leave.update({status: 'cancelled', approved: 0}, {where: {id: req.params.id}} ).then(leave => {
        res.status(200).json({'message' : 'Leave request rejected sucessfully!', 
                          'status':1});
    }).catch(err =>{
        res.status(403).json({'message' : 'Error rejecting the leave application! ' + err, 
                          'status':0});
    });
}


module.exports = {
    getLeaves,
    createLeave,
    requestLeave,
    cancelLeave,
    getLeave,
    approveLeave,
    rejectLeave
}
