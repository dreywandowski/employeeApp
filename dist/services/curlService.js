"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const log_1 = require("../logger/log");
const postResource = async (payload, resource) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios_1.default.post(`${process.env.FLW_BASE_URL}${resource}`, payload, config);
        return response.data;
    }
    catch (error) {
        log_1.default.error(`Error getting resource with error:`, error.response.data);
        throw new Error("Error getting resource with error: " + error.response.data);
    }
};
const getResource = async (resource, params, data = '') => {
    const queryParams = params ? `?${params}` : '';
    const returnString = data ? 1 : 0;
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios_1.default.get(`${process.env.FLW_BASE_URL}${resource}${queryParams}`, config);
        const data = returnString ? response.data : response.data.data;
        return data;
    }
    catch (error) {
        log_1.default.error(`Error posting resource with error:`, error.response.data);
        throw new Error("Error posting resource with error: " + error.response.data);
    }
};
module.exports = {
    getResource,
    postResource,
};
//# sourceMappingURL=curlService.js.map