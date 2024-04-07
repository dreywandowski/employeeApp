const insertData = (table, data) => {
    return table.create(data).
    then(created => {
        return created;
    }).catch(err => {
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
            default:
        }
        throw new Error('Error creating ' + record + ': ' + err); 
    });
}
    
const getData = (table, clause) => {
    let qry = '';
    if (clause && Object.keys(clause).length !== 0) {
        qry = table.findAll({ where: clause });
    } else {
        qry = table.findAll();
    }
    return qry.then(data => {
        return data;
    }).catch(err => {
        throw new Error('Error getting the record: ' + err); 
    });
}

const updateData = (table, attributes, clause) => {
    return table.update(attributes, { where: clause }).
    then(data => {
        return data;
    }).catch(err => {
        throw new Error('Error updating the record: ' + err); 
    });
}
      module.exports = {
        insertData,
        getData,
        updateData
      };
      
