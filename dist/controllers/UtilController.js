var users = require('../models/Users');
var bank = require('../models/bank');
var pdf = require('html-pdf');
var options = { format: 'Letter' };
const ejs = require('ejs');
const EventEmitter = require('events');
const fs = require('fs');
const https = require('https');
const env = require('dotenv').config();
const getRequest = (options_get) => {
    const options = {
        method: 'GET',
        hostname: options_get.host,
        path: options_get.path,
        maxRedirects: options_get.maxRedirects,
        headers: options_get.headers
    };
    const request = https.request(options, function (response) {
        const chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
        response.on('end', function () {
            try {
                const body = Buffer.concat(chunks);
                const data = JSON.parse(body.toString());
                res.status(200).json({
                    message: 'success in the util!',
                    result: data,
                    status: 1,
                });
            }
            catch (error) {
                res.status(403).json({
                    message: 'Error retrieving data in the util... ' + error.message,
                    status: 0,
                });
            }
        });
        response.on('error', function (error) {
            res.status(500).json({
                message: 'Internal Server Error in the util: ' + error.message,
                status: 0,
            });
        });
    });
    request.end();
};
const postRequest = (req, res) => {
    const payload = JSON.stringify({
        currency: 'NGN',
    });
    const options = {
        method: 'POST',
        hostname: 'api.paystack.co',
        path: '/bank',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
        },
    };
    const apiRequest = https.request(options, function (response) {
        const chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
        response.on('end', function () {
            try {
                const body = Buffer.concat(chunks);
                const banks = JSON.parse(body.toString());
                res.status(200).json({
                    message: 'Banks List retrieved successfully!',
                    Banks: banks,
                    status: 1,
                });
            }
            catch (error) {
                res.status(403).json({
                    message: 'Error retrieving banks... ' + error.message,
                    status: 0,
                });
            }
        });
        response.on('error', function (error) {
            res.status(500).json({
                message: 'Internal Server Error: ' + error.message,
                status: 0,
            });
        });
    });
    apiRequest.write(payload);
    apiRequest.end();
};
module.exports = {
    getRequest,
    postRequest
};
//# sourceMappingURL=UtilController.js.map