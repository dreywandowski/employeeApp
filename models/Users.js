const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;


// create a users table
const Users = sequelize.define('users', {
 // Model attributes are defined here
 firstName: {
    type: DataTypes.STRING,
    allowNull: false
 },
 lastName: {
    type: DataTypes.STRING,
    allowNull: false
 },
username:{
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
},
password:{
    type: DataTypes.STRING,
    allowNull: true
},
age: {
    type: DataTypes.INTEGER,
    allowNull: true
}
,
isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
},
email: {
    type: DataTypes.STRING,
    allowNull: true
},
department: {
    type: DataTypes.STRING,
    allowNull: true
},
supervisor: {
    type: DataTypes.STRING,
    allowNull: true
},
subordinates: {
    type: DataTypes.JSON,
    allowNull: true
},
jwt: {
    type: DataTypes.STRING,
    allowNull: true
}
});


//console.log(Users === sequelize.define.Users);

// this creates the table immediately
// we can alter the tble by passing in alter:true object param in the sync({alter:true}) method
/*Users.sync({alter:true}).then(res =>{
console.log('table synced OK!', res);
const user = Users.build({
    firstName: 'drey',
    username: 'test_User001',
    lastName: 'hey',
    password: 'haaaa',
    age: 90,
    isAdmin: false
});
return user.save();
}).then(res => {
    console.log('our first user has been saved!');
}).catch(err =>{
    console.log('error with table syncing!', err);
});*/

//query all users
/*Users.sync().then(res =>{
    return Users.findAll();
    }).then(res => {
        res.forEach(element => {
           console.log(element.toJSON()); 
        });
        console.log('our users');
    }).catch(err =>{
        console.log('error with table syncing!', err);
    });
    */

module.exports = Users;