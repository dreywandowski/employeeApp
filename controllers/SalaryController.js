var users = require('../models/Users');

// salary calculation
const calculateSalary = (req, res) => {
 let basic_salary = 70000;  let hmo = 50000; let housing = 7000; let furniture = 6500; 
 let leave = 40000; let dressing = 30000; let transport = 9000; let education = 8000; 
 let utility = 30000;

 const allowed_grades = ["ABO", "SET", "EXE", "RED"];

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

                res.status(200).json({'message' : 'Salary computed successfully!', 
                'salary': salary, 'status': 1});
            }
               else{
                throw new Error('Not among approved grades!!');
               }
            }).
        catch(err =>{
            res.status(404).json({'message' : 'Unable to set up salary calulation', 
            'error': " "+err, 'status': 0});
        });


}
// retrive my salary calculation/breakdown

// convert my payroll breakdown to PDF



module.exports = {
    calculateSalary
}