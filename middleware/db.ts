import mongoose from "mongoose";
import { DBConnectionString } from "../config";
import { Context } from "@azure/functions";


let db =null;
const init = async (logger:Context) => {
    if (!db) {
    try{

      db = await mongoose.connect(DBConnectionString);
      logger.log("Connect DB")
    } catch(error){
      logger.log(error);
    }
    }
};

export default init;