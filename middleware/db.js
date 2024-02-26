const mongoose = require('mongoose');
const {DBConnectionString} = require('../config')

let db =null;
const init = async () => {
    if (!db) {
    try{

      db = await mongoose.connect(DBConnectionString);
      console.log("Connect DB")
    } catch(error){
      console.log(error);
    }
    }
};

module.exports = { init };