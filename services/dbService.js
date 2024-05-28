const raw_log = require('../models/raw_logs');
const logger = require('../logger/log');

const insertData = async (table, data) => {
    try{
    let created = await table.create(data);
    return created;
    }
    catch(err) {
        let record = 'record';
        switch (table){
            case "User":
            record = 'user';
            break;
            case "password_resets":
                record = 'verification pin';
                break;
                case "User":
                    record = 'user';
                    break;
                    case "job":
                        record = 'job';
                        break;
            default:
        }
        logger.error(`${new Date().toISOString()} : Error creating  ${record} with error:`, err);
        throw new Error(`Error creating  ${record} with error:`, err);
    }
}
   

const getData = async (table, clause, exclude_list) => {
    try {
        let qry = '';
        if (clause && Object.keys(clause).length !== 0) {
            qry = await table.findAll({ where: clause, attributes: { exclude: exclude_list } });
        } else {
            qry = await table.findAll();
        }
        if (qry.length === 0) {
            throw new Error("Data doesn't exist!!");
        }
        return qry;
    } catch (err) {
        logger.error(`${new Date().toISOString()} : Error getting the record with error:`, err);
        throw new Error('Error getting the record: ' + err.message); 
    }
}


const updateData = async(table, attributes, clause) => {
    try{
    let data = await table.update(attributes, { where: clause });
    return data;
  }catch(err) {
    logger.error(`${new Date().toISOString()} : Error updating the record with error:`, err);
     throw new Error('Error updating the record: ' + err); 
    }
}


const raw_logs = async(title, body) => {
    try{
        let data = {title: title, body: JSON.stringify(body)}; 
        await raw_log.create(data);
        return true;
      }catch(err) {
            logger.error(`${new Date().toISOString()} : Error creating the log with error:`, err); 
            throw new Error('Error creating the log: ' + err);
        }
}

      module.exports = {
        insertData,
        getData,
        updateData,
        raw_logs
      };
      
