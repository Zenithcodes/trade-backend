require("dotenv").config()
 const DBConnectionString=process.env.DB_Connection_String
 const tokenSecret = process.env.Token_Secret
 module.exports={
    DBConnectionString,
    tokenSecret
 }