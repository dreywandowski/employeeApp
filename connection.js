const env = require('dotenv').config();
const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const  sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

//  test our connection returns a Promise[]
sequelize.authenticate().then((response)=>{
    console.log("connected succesfully using sequelize!!");
    }).catch((err)=> {
        console.log("Error connecting", err);
    })  
    
    
    module.exports  = {
        sequelize,
        DataTypes
    };