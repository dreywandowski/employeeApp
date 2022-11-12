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



// assign an employee to an appropriate supervisor
// TOD0: Fix saving multiple surbodinates not saving to an array and error message showing
// even after a successful assignment

const assignEmployee = (req, res) =>{
    users.findAll({
        where: {username: req.params.name }, 
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
}). then(user =>{
     users.findAll({
        where: {isAdmin: 1, department : user[0].department }, 
       attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    }).
    then(admin =>{
        const upd_array = user[0].username.split();

        if(admin[0].subordinates === null){
            let db = admin[0].subordinates;
            const final_save = db.concat(upd_array);
            users.update(
                {subordinates: final_save},
                {where: {username: admin[0].username} }
            );
        }
        else{
            let db = admin[0].subordinates;
            db = [];
            const final_save = db.concat(upd_array);
            users.update(
                {subordinates: final_save},
                {where: {username: admin[0].username} }
            );
        }
        }).
         then(yes =>{
            res.status(200).json({'message' : 'Employee assignment completed sucessfully! '+
            req.params.name+' is now under '+ admin[0].username, 
              'status': 1});
         }).
    catch(err =>{
        res.status(404).json({'message' : 'Error assigning supervisor to the user!', 
        'error': err, 'status': 0});
    });
}); 
//});
}



module.exports = {
    employee_id,
    getEmployees,
    deleteEmployee,
    assignEmployee
   
}