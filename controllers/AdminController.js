var users = require('../models/Users');

// get an employee
const employee_id = (req, res) => {
     const username = req.params.name;
    
    users.sync().then(data =>{
        return users.findByPk(username,
            {
                attributes: {
                    exclude: ['password', 'createdAt']
                 } 
            });
         }).then(resp => {
            if(resp === null){
                res.status(404).json({'message' : 'User not found!', 
                'status': 0});
            }else{
                res.status(200).json({'message' : 'User retrieved sucessfully!', 
                'user': resp, 'status': 1});
            }
         }).
        catch(err =>{
            res.status(404).json({'message' : 'Error Retrieving user!', 
            'error': err, 'status': 0});
        });
}

    
// get all employees
const getEmployees = (req, res) => {
    users.sync().then(data =>{
        return users.findAll({
            attributes: { exclude: ['password', 'createdAt'] }
    });
        }).
        then(users =>{
                res.status(200).json({'message' : 'User list retrieved sucessfully!', 
                'users': users, 'status': 1});
            }).
        catch(err =>{
            res.status(404).json({'message' : 'Error Retrieving user list!', 
            'error': err, 'status': 0});
        });

}

// delete an employee
const deleteEmployee = (req, res) => {
    const username = req.params.name;

    users.sync().then(data =>{
        return users.destroy({
            where: {
                username: username
            }
        });
         }).then(resp => {
            if(resp === 1){
                res.status(200).json({'message' : 'User deleted succesfully!', 
                'status': resp});
            }
           else{
                res.status(404).json({'message' : 'Error deleting the user, verify that it exists!', 
                'status': resp});
            }
         }).
        catch(err =>{
            res.status(404).json({'message' : 'Error deleting the user!', 
            'error': err, 'status': 0});
        });
}



module.exports = {
    employee_id,
    getEmployees,
    deleteEmployee
   
}