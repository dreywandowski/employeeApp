const axios = require('axios');
const postResource = async (payload, resource) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post(`${process.env.FLW_BASE_URL}${resource}`, payload, config);
        return response.data;
      } catch (error) {
       return error.response.data;
      }
}

const getResource = async (resource, params) => {
    const queryParams = params ? `?${params}` : '';
    try {
        const config = {
          headers: {
              'Authorization': `Bearer ${process.env.FLW_SECRET}`,
              'Content-Type': 'application/json'
          }
      };
    const response = await axios.get(`${process.env.FLW_BASE_URL}${resource}${queryParams}`, config);
    const data = response.data.data;
    
    return data;
      } catch (error) {
        return error.response.data;
      }

}



module.exports = {
    getResource,
    postResource,
    //patchResource,
    //deleteResource
}