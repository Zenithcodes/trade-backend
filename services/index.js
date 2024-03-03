const axios = require('axios')

const useFetch = async (config) => {
    let response = null;
    try {
      const res = await axios(config);
      response = res.data;
    } catch (er) {
      response = er;
    }
    return response;
  };
  
module.exports = useFetch