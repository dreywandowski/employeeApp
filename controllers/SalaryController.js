const users = require('../models/Users');
const bank = require('../models/bank');
const transactions = require('../models/transaction');
const pdf = require('html-pdf');
const options = {format: 'Letter'};
const ejs = require('ejs');
const EventEmitter = require('events');
const fs = require('fs');
const https = require('https');
const env = require('dotenv').config();
const { getResource, postResource} = require('../services/curlService');
const { insertData, getData, updateData, raw_logs } = require('../services/dbService');

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

// make salary payment for staff
async function paySalary (req, res){
    try{
    const check = await getData(bank, {username: req.query.username });
    const bank_code = await checkBank(check[0].dataValues.bankName);
    let payload = {
        "bank_code" : bank_code, // 044
        "acct_num" : check[0].dataValues.accountNumber,  //0690000040
        "amount" : req.body.amount,
        "narration" :  req.body.narration,
    }
             const send = transfers(payload);
             if(send != false){
                res.status(200).json({'message' : 'Transfer initiated sucessfully! Please check your bank account', 'status': 1});
             }else{
                return "Unable to transfer funds, error = "+send;
             }
           }

    catch(err){
        res.status(404).json({'message' : 'Error Initiating bank transfer!', 
        'error': err, 'status': 0});
    };
}


    
// transfer salary to employee
async function transfers(transferDetails){
    try{
    let ref = 'flw_' + new Date().getUTCMilliseconds();
    let payload = {
        "account_bank" : transferDetails.bank_code,
        "account_number" : transferDetails.acct_num,
        "amount" : transferDetails.amount,
        "narration" :  transferDetails.narration,
        "currency" : "NGN",
        "reference" : ref,
        "callback_url" : `${process.env.BASE_URL}transferCallback`,
        "debit_currency" : "NGN",
    };
    const transfer = await postResource(payload,'/transfers');

    // log the transfer payload
    raw_logs('transfer_payload for '+ref, payload);

    if(transfer.status == "success"){
        raw_logs('transfer_init_success_response for '+ref, transfer);
        return transfer.data.id;
    }
    else{
        raw_logs('transfer_failed_response for '+ref, transfer);
        return 0;
    }
   }
  catch(err){
    return err; 
         }
}


async function transfersCallback (req, res){
    try{
        let verifyResponse = await verifyTransfer(req.params.id);
            
     if ((verifyResponse.status == 'successful' || verifyResponse.status == 'success') && verifyResponse.data.status != "FAILED" ){
        raw_logs('transfer_webhook_success for '+verifyResponse.data.reference, 'verify_response: ' +verifyResponse);
        //await insertData(transactions, {email: email, token: pin });
    }
    else{
        raw_logs('transfer_webhook_failed for '+id, 'verify_response: ' +verifyResponse);    
        return false;
    }
}
    catch(err){
      return err;
    }
}


// get the Nigerian Bank of the employee for transfer
async function checkBank(bank_name){
        var bank_details = await getResource('/banks/NG');
        for (const bank of bank_details) {
            if (bank.name === bank_name) {
                return bank.code; 
            }
        };
          throw new Error(`Bank with name '${bank_name}' not found`);
}


module.exports = {
    mySalaryBreakDown,
    download,
    addAccount,
    paySalary,
    transfersCallback
}