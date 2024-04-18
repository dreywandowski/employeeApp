const request = require('request');

const postResource = async (payload, resource) => {
    const options = {
        url: `https://api.flutterwave.com/v3${resource}`,
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
                reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
            }
        });
    });
}




const getResource = (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.paystack.co/bank?currency=NGN',
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET}`,
            'Content-Type': 'application/json'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            res.status(500).json({
                message: 'Internal Server Error: ' + error.message,
                status: 0
            });
            return;
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
                const banks = JSON.parse(body);
                res.status(200).json({
                    message: 'Banks List retrieved successfully!',
                    banks: banks.data,
                    status: 1
                });
            } catch (parseError) {
                res.status(403).json({
                    message: 'Error retrieving banks... ' + parseError.message,
                    status: 0
                });
            }
        } else {
            res.status(403).json({
                message: 'Error retrieving banks... Status Code: ' + response.statusCode,
                status: 0
            });
        }
    });
}


module.exports = {
    getResource,
    postResource,
    //patchResource,
    //deleteResource
}