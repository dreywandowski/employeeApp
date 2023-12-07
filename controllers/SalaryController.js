var users = require('../models/Users');
var bank = require('../models/bank');
var pdf = require('html-pdf');
var options = {format: 'Letter'};
const ejs = require('ejs');
const EventEmitter = require('events');
const fs = require('fs');
const https = require('https');
const env = require('dotenv').config();
//var { getRequest, postRequest } = require('./UtilController');

var eventEmitter = new EventEmitter();
// create a pdf file of the salary breakdown
eventEmitter.on('toPDF', (msg) => {
    const createPDF = (msg) => {
        //console.log(msg);
     ejs.renderFile('/var/www/html/payroll/assets/templates/salary_breakdown.ejs', {data:msg}, (err, HTML) => {
        pdf.create(HTML, options).toFile('./downloads/employee_salary.pdf',  (err, result) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
        }  
});
if (err) {
    return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
    });
}});
}
        createPDF(msg);
 });

    
// retrive my salary calculation/breakdown
const mySalaryBreakDown = (req, res) => {
    const allowed_grades = ["ABO", "SET", "EXE", "RED"]; 
    let basic_salary = 70000;  let hmo = 50000; let housing = 7000; let furniture = 6500; 
    let leave = 40000; let dressing = 30000; let transport = 9000; let education = 8000; 
    let utility = 30000;

    let username = req.params.name;
    users.findOne({where: {username: username}, 
        attributes: ['username', 'firstName', 'lastName','rank']}).
         then(resp =>{
            if(allowed_grades.includes(resp.rank)){
                switch(resp.rank){
                    case "ABO":
                        basic_salary = basic_salary + 5500;
                        hmo = hmo * 7.05;
                        leave = leave * 5.45;
                        break;

                        case "SET":
                            basic_salary = basic_salary + 3500;
                            hmo = hmo * 6.45;
                            leave = leave * 4.45;
                            break;

                            case "RED":
                                basic_salary = basic_salary + 2500;
                                hmo = hmo * 5.88;
                                leave = leave * 3.45;
                                break;

                                case "EXE":
                                    basic_salary = basic_salary + 1500;
                                    hmo = hmo * 3.45;
                                    leave = leave * 1.45;
                                    break;

                                    default:

                }
                const salary = basic_salary + hmo + housing + furniture + leave + dressing + transport + education + utility;
               
                    const content = [
                      {"basic_salary": basic_salary, "hmo" : hmo,
                      "housing":housing, "furniture": furniture, 
                      "leave_allowance": leave, "dressing": dressing, 
                      "transport": transport, "education": education,
                       "utility": utility, "total_earnings":salary, "username": username,
                       "full_name": resp.firstName + ' '+resp.lastName, "rank": resp.rank }
                    ]
                    
                eventEmitter.emit('toPDF', content);
                res.status(200).json({'message' : 'Salary breakdown completed successfully!', 
                 content, 'status': 1});

            }
               else{
                throw new Error('Not among approved grades!!');
               }
        }).catch(err => {
            res.status(404).json({'message' : 'Unable to set up salary calculation', 
            'error': " "+err, 'status': 0});
        });
}

// download salary breakdown
const download = (req, res) =>{
        const file = './downloads/employee_salary.pdf';
         fs.exists(file,  (doesExist) => {
            if (doesExist) {
              console.log('file exists');

              //file exists
               res.download(file,(lol) =>{
              // remove file after succesful download
                fs.unlink(file, (err => {
                    if (err) console.log("Unable to delete " +err);
                    else {
                      console.log("\nDeleted file: "+file);
                    }
                  }));
               });   
            } else {
                res.status(404).json({'message' : 'File is not existent!!', 
                'status': 0});
            }
          });
         
          

}

// add account details for staff
const addAccount = (req, res) => {
    var qry = req.body;
    let username = qry.username;

    const banks_acc = bank.create({
        accountName: qry.accountName,
        accountNumber: qry.accountNumber,
        bankName: qry.bankName,
        bankCode: qry.bankCode,
        username: qry.username
    }).then(resp => {
        res.status(201).json({'message' : 'Bank account for user ' + username + ' sucessfully created', 'status':1});
    }).catch(err => {
        res.status(403).json({'message' : 'Error creating an account for the user ' + err, 
        'status':0});
    });
}

// create transfer recipient
const createTransferRecipient = (name, account_number, bank_code) => {
const params = JSON.stringify({
"type": "nuban",
"name":name,
"account_number": account_number,
"bank_code": bank_code,
"currency": "NGN"
});

let token = process.env.PAYSTACK_SECRET;

const options ={
    hostname: "api.paystack.co",
    port: 443,
    path: "/transferrecipient",
    method: "POST",
    headers: {
        "Authorization": Bearer `${process.env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json"
    }
}
const req = https.request(options, res => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk
    }
    );
    
    res.on('end', () =>{
    console.log(JSON.parse(data));
    let result = [Math.random(), data.recipient_code];
    return result;
    }).on('error', error => {
        console.error(error);
        return result = [error];
    })
})

req.write(params);
req.end();
}

// initiate transfer to employee
const transferMoney = (amount, ref, recipient) =>{
    const params = JSON.stringify({
        "source": "balance",
        "amount": amount,
        "reference": ref,
        "recipient": recipient,
        "reason": "Salary Payment"
        });
        
        let token = process.env.PAYSTACK_SECRET;
        
        const options ={
            hostname: "api.paystack.co",
            port: 443,
            path: "/transfer",
            method: "POST",
            headers: {
                "Authorization": Bearer `${process.env.PAYSTACK_SECRET}`,
                "Content-Type": "application/json"
            }
        }
        const req = https.request(options, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk
            }
            );
            
            res.on('end', () =>{
            console.log(JSON.parse(data));
            let result = [data.status, data.id, data.createdAt];
            return result;
            }).on('error', error => {
                console.error(error);
                return result = [error];
            })
        })
        
        req.write(params);
        req.end();
}

// make salary payment for staff
const paySalary = (req, res)=>{
    let username = req.params.username;
     bank.findOne({where: {username:username}}).
     then(account =>{
           if(account == null){
            throw new Error("No bank account exists for specified user");
           }

           let name = account.accountName;
           let account_number = account.accountNumber;
           let bank_code = account.bankCode;

           const createReciver = createTransferRecipient(name, account_number, bank_code);
           if(createReciver.length !=1){
             const send = transferMoney(amount, createReciver[0], createReciver[1]);
             if(send.length !=1){
                res.status(200).json({'message' : 'Transfer initiated sucessfully! Please check your bank account', 'status': 1});
             }else{
                throw new Error("Unable to transfer funds, error = "+send.error);
             }
           }else{
            throw new Error("Unable to create transfer reciepient, error == "+createReciver.error);
           }

        }).
    catch(err =>{
        res.status(404).json({'message' : 'Error Retrieving bank account for '+ username+' ', 
        'error': err, 'status': 0});
    });
}



// list avalible Nigerian Banks
const listBanks = (req,res) => {
    const options = {
        method: 'GET',
        hostname: 'api.paystack.co',
        path: '/bank?currency=NGN',
        maxRedirects: 20,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        }
      };

     // var call = getRequest(options);
     // return;
    
      const request = https.request(options, function (response) {
        const chunks = [];
    
        response.on('data', function (chunk) {
          chunks.push(chunk);
        });
    
        response.on('end', function () {
          try {
            const body = Buffer.concat(chunks);
            const banks = JSON.parse(body.toString());
    
            // Send the JSON response to the user with a status code of 200
            res.status(200).json({
              message: 'Banks List retrieved successfully!',
              banks: banks.data,
              status: 1,
            });
          } catch (error) {
            // Handle parsing error and send an error response to the user with a status code of 403
            res.status(403).json({
              message: 'Error retrieving banks... ' + error.message,
              status: 0,
            });
          }
        });
    
        response.on('error', function (error) {
          // Handle response error and send an error response to the user with a status code of 500
          res.status(500).json({
            message: 'Internal Server Error: ' + error.message,
            status: 0,
          });
        });
      });
    
      request.end();
}


module.exports = {
    mySalaryBreakDown,
    download,
    addAccount,
    paySalary,
    listBanks
}