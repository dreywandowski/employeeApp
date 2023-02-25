var users = require('../models/Users');
var pdf = require('html-pdf');
var options = {format: 'Letter'};
const ejs = require('ejs');
const EventEmitter = require('events');

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



module.exports = {
    mySalaryBreakDown
}