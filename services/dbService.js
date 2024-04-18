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
        throw new Error('Error creating ' + record + ': ' + err); 
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
        throw new Error('Error getting the record: ' + err.message); 
    }
}


const updateData = async(table, attributes, clause) => {
    try{
    let data = await table.update(attributes, { where: clause });
    return data;
  }catch(err) {
        throw new Error('Error updating the record: ' + err); 
    }
}

      module.exports = {
        insertData,
        getData,
        updateData
      };
      
