"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankEmployee = exports.deleteEmployee = exports.getEmployees = exports.employee_id = void 0;
const employee_id = (req, res) => {
    const username = req.params.name;
    users.sync().then(data => {
        return users.findAll({
            where: { username: username },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'jwt']
            }
        });
    }).then(resp => {
        if (resp === null) {
            res.status(404).json({
                'message': 'User not found!',
                'status': 0
            });
        }
        else {
            res.status(200).json({
                'message': 'User retrieved sucessfully!',
                'user': resp, 'status': 1
            });
        }
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving user!',
            'error': err, 'status': 0
        });
    });
};
exports.employee_id = employee_id;
const getEmployees = (req, res) => {
    users.sync().then(data => {
        return users.findAll({
            attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'jwt'] }
        });
    }).
        then(users => {
        res.status(200).json({
            'message': 'User list retrieved sucessfully!',
            'users': users, 'status': 1
        });
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error Retrieving user list!',
            'error': err, 'status': 0
        });
    });
};
exports.getEmployees = getEmployees;
const deleteEmployee = (req, res) => {
    const username = req.params.name;
    users.sync().then(data => {
        return users.destroy({
            where: {
                username: username
            }
        });
    }).then(resp => {
        if (resp === 1) {
            res.status(200).json({
                'message': 'User deleted succesfully!',
                'status': resp
            });
        }
        else {
            res.status(404).json({
                'message': 'Error deleting the user, verify that it exists!',
                'status': resp
            });
        }
    }).
        catch(err => {
        res.status(404).json({
            'message': 'Error deleting the user!',
            'error': err, 'status': 0
        });
    });
};
exports.deleteEmployee = deleteEmployee;
const rankEmployee = (req, res) => {
    var username = req.params.name;
    var qry = req.body.rank;
    users.update({ rank: qry }, {
        where: { username: username }
    }).then(resp => {
        res.status(200).json({
            'message': 'User assigned the rank ' + qry + ' successfully!',
            'status': 1
        });
    })
        .catch(err => {
        res.status(401).json({
            'message': ' Error updating user! ' + err,
            'status': 0
        });
    });
};
exports.rankEmployee = rankEmployee;
//# sourceMappingURL=AdminController.js.map