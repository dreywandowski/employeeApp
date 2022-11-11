const conn = require('../connection');
const sequelize = conn.sequelize;
const DataTypes = conn.DataTypes;


// create a leave model
const Leave = sequelize.define('leave', {
 purpose: DataTypes.STRING,
 type: DataTypes.STRING,
 status: DataTypes.STRING,
 date_from: DataTypes.DATE,
 date_to: DataTypes.DATE,
 username: DataTypes.STRING,
 approved: DataTypes.BOOLEAN,
 approved_by: DataTypes.STRING,
 rejected_by: DataTypes.STRING
});


module.exports = Leave;




/*'use strict';
const {
  Model
} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    /*
    static associate(models) {
      // define association here
    }
  }
  Leave.init({
    purpose: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    date_from: DataTypes.DATE,
    date_to: DataTypes.DATE,
    username: DataTypes.STRING,
    approved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Leave',
  });
  return Leave;
};*/
