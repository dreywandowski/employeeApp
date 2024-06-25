var leave = require('../models/leave');
const env = require('dotenv').config();
const EventEmitter = require('events');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
var eventEmitter = new EventEmitter();
eventEmitter.on('sendMail', (msg) => {
    const sendEmail = (receiver, subject, content) => {
        user = process.env.MAIL_USERNAME;
        pass = process.env.MAIL_PWD;
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: user,
                pass: pass
            }
        });
        ejs.renderFile('/var/www/html/payroll/assets/templates/leaves_list_email_template.ejs', { content: msg }, (err, data) => {
            if (err) {
                console.log("error opening the file!! " + err);
            }
            else {
                var mailOptions = {
                    from: 'admin@employeeapp.com',
                    to: 'aduramimo@gmail.com',
                    subject: subject,
                    html: data
                };
            }
            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("cant send mail!! " + err);
                }
                else {
                    console.log("mail sent ok " + "content==" + msg + info);
                }
            });
        });
    };
    sendEmail("aduramimo@gmail.com", "Leave requests awaiting your approval");
});
eventEmitter.on('sendFeedbackMail', (msg) => {
    const sendEmail = (receiver, subject, content) => {
        user = process.env.MAIL_USERNAME;
        pass = process.env.MAIL_PWD;
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: user,
                pass: pass
            }
        });
        ejs.renderFile('/var/www/html/payroll/assets/templates/leaves_approved_rejected.ejs', { content: msg }, (err, data) => {
            if (err) {
                console.log("error opening the file!! " + err);
            }
            else {
                var mailOptions = {
                    from: 'admin@employeeapp.com',
                    to: 'aduramimo@gmail.com',
                    subject: subject,
                    html: data
                };
            }
            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("cant send mail!! " + err);
                }
                else {
                    console.log("mail sent ok " + "content==" + msg + info);
                }
            });
        });
    };
    sendEmail("aduramimo@gmail.com", "Update on Your Leave Application");
});
const getLeaves = (req, res) => {
    let username = req.user.user;
    return leave.findAll({
        where: {
            username: username
        }
    }).then(leave => {
        res.status(200).json({
            'message': 'Leave list retrieved sucessfully!',
            'leaves': leave, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving leave list!',
            'error': err, 'status': 0
        });
    });
};
const getLeave = (req, res) => {
    let username = req.user.user;
    let id = req.params.id;
    return leave.findAll({ where: { username: username, id: id } }).
        then(leave => {
        res.status(200).json({
            'message': 'Leave item retrieved sucessfully!',
            'leaves': leave, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving leave!',
            'error': err, 'status': 0
        });
    });
};
const createLeave = (req, res) => {
    let username = req.user.user;
    let purpose = req.body.purpose;
    let type = req.body.type;
    let status = req.body.status;
    let date_from = req.body.date_from;
    let date_to = req.body.date_to;
    leave.create({
        username: username,
        purpose: purpose,
        type: type,
        status: status,
        date_from: date_from,
        date_to: date_to
    }).then(leave => {
        res.status(201).json({
            'message': 'Leave request created sucessfully!',
            'status': 1
        });
    }).catch(err => {
        res.status(403).json({
            'message': 'Error creating the leave application! ' + err,
            'status': 0
        });
    });
};
const requestLeave = (req, res) => {
    leave.update({ status: 'requested', }, {
        where: {
            id: req.params.id
        }
    })
        .then(leave => {
        var leave = require('../models/leave');
        let id = req.params.id;
        leave.findAll({ where: { id: id } }).
            then(found => {
            eventEmitter.emit('sendMail', found);
            res.status(200).json({
                'message': 'Leave requested sucessfully!',
                'status': 1
            });
        }).catch(err => {
            res.status(403).json({
                'message': 'Error requesting the leave application! ' + err,
                'status': 0
            });
        });
    });
};
const cancelLeave = (req, res) => {
    leave.update({ status: 'cancelled', }, { where: { id: req.params.id } }).then(leave => {
        res.status(200).json({
            'message': 'Leave request cancelled sucessfully!',
            'status': 1
        });
    }).catch(err => {
        res.status(403).json({
            'message': 'Error cancelling the leave application! ' + err,
            'status': 0
        });
    });
};
const getLeavesApproval = (req, res) => {
    return leave.findAll({
        where: {
            status: 'requested'
        }
    }).then(leave => {
        res.status(200).json({
            'message': 'Leave list retrieved sucessfully!',
            'leaves': leave, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving leave list!',
            'error': err, 'status': 0
        });
    });
};
const approveLeave = (req, res) => {
    leave.update({ approved: 1, approved_by: req.user.user }, { where: { id: req.params.id } }).then(leave => {
        eventEmitter.emit('sendFeedbackMail', 1);
        res.status(200).json({
            'message': 'Leave request approved sucessfully!',
            'status': 1
        });
    }).catch(err => {
        res.status(403).json({
            'message': 'Error approving the leave application! ' + err,
            'status': 0
        });
    });
};
const rejectLeave = (req, res) => {
    leave.update({ status: 'cancelled', approved: 0, rejected_by: req.user.user }, { where: { id: req.params.id } }).then(leave => {
        eventEmitter.emit('sendFeedbackMail', 0);
        res.status(200).json({
            'message': 'Leave request rejected sucessfully!',
            'status': 1
        });
    }).catch(err => {
        res.status(403).json({
            'message': 'Error rejecting the leave application! ' + err,
            'status': 0
        });
    });
};
module.exports = {
    getLeaves,
    createLeave,
    requestLeave,
    cancelLeave,
    getLeave,
    getLeavesApproval,
    approveLeave,
    rejectLeave
};
//# sourceMappingURL=LeaveController.js.map