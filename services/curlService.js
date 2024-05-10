const postResource = (payload, resource) => {
  const options = {
    url: `${process.env.FLW_BASE_URL}${resource}`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET}`,
        'Content-Type': 'application/json'
    },
    json: JSON.stringify(payload)
};
  
  // Make the POST request
  fetch(options.url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Post request response:', data);
      return;
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
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