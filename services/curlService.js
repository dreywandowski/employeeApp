const request = require('request');

const postResource = async (payload, resource) => {
    const options = {
        url: `${process.env.FLW_BASE_URL}${resource}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            if (response.statusCode >= 200 && response.statusCode < 300) {
                resolve(JSON.parse(body));
            } else {
                reject(new Error(`Failed to load resource, status code: ${response.statusCode}`));
            }
        });
    });
}


const getResource = async (resource, params) =>  {
    const queryParams = params ? `?${params}` : '';
    const options = {
        url: `${process.env.FLW_BASE_URL}${resource}${queryParams}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET}`,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            if (response.statusCode >= 200 && response.statusCode < 300) {
               //let responseData = resolve(JSON.parse(body));
                resolve(body);
            } else {
                reject(new Error(`Failed to load resource, status code: ${response.statusCode}`));
            }
        });
    });
}



module.exports = {
    getResource,
    postResource,
    //patchResource,
    //deleteResource
}