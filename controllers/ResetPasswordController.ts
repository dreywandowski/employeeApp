var users = require('../models/Users');
var password_resets = require('../models/password_resets');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 86450 });
const env = require('dotenv').config();
const EventEmitter = require('events');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
var eventEmitter = new EventEmitter();

// send mail to the new user for verification
eventEmitter.on('sendForgotPassword', (pin, email) => {
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

        ejs.renderFile('/var/www/html/payroll/assets/templates/reset_password_template.ejs', { content: pin }, (err, data) => {
            if (err) {
                console.log("error opening the file!! " + err);
            } else {
                var mailOptions = {
                    from: 'admin@employeeapp.com',
                    to: email,
                    subject: subject,
                    html: data
                };
            }

            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("cant send mail!! " + err);
                } else {
                    console.log("mail sent ok " + "content==" + msg + info);
                }
            });
        });
    }
    sendEmail(email, "Your Password Reset Token");
});


// forgot password
const forgot_pwd = (req, res) => {
    var check = users.findOne({
        where: {
            email: req.body.email
        }
    }).then(data => {
        if (data === null) {
            throw Error("User doesn't exist!!");
        }
        const pin = Math.floor(Math.random() * 999999) + 100000;

        password_resets.findOne({
            where: {
                email: req.body.email
            }
        }).then(ok => {
            if (ok === null) {
                password_resets.create({
                    email: req.body.email,
                    token: pin
                });
            }
            else {
                password_resets.update({
                    token: pin
                },
                    { where: { email: req.body.email } });
            }
            eventEmitter.emit('sendForgotPassword', pin, req.body.email);
            res.status(200).json({
                'message': 'Password reset token has been sent to your email!',
                'status': 1
            });
        }
        );
    }).catch(err => {
        res.status(400).json({
            'message': 'Error re-creating the PIN or sending mail! ' + err,
            'status': 0
        });
    })

}

// verify pwd reset token
const verify_reset = (req, res) => {
    password_resets.findOne({
        where: {
            email: req.body.email,
            token: req.body.pin
        }
    }).then(resp => {
        if (resp === null || resp === '') {
            throw Error('Invalid token!');
        }
    });

    password_resets.destroy({
        where: {
            email: req.body.email,
            token: req.body.pin
        }
    }).then(deleted => {
        if (!deleted) {
            throw Error("Error deleting the user token, no details exist with your input!!");
        }
        res.status(200).json({ 'message': 'You can now reset your password!', 'status': 1 })
    }).
        catch(err => {
            res.status(500).json({ 'message': 'Some error occured while trying to verify your token! ' + err, 'status': 0 })

        });

}

// reset password
const resetPwd = (req, res) => {
    let password = req.body.password;

    bcrypt.hash(password, 15)
        .then(hash => {
            console.log("our hashed pwd:" + hash);
            users.update(
                {
                    password: hash
                },
                { where: { email: req.body.email } }
            ).then(change => {
                if (!change) {
                    throw Error("unable to change password!!, might be a db issue");
                }
                res.status(200).json({ 'message': 'Password reset succesful!', 'status': 1 })

            });

        }).catch(err => {
            res.status(400).json({ 'message': 'Error while reseting password ' + err, 'status': 0 })

        });
}


module.exports = {
    forgot_pwd,
    verify_reset,
    resetPwd

}