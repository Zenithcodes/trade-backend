require("dotenv").config()
 const DBConnectionString=process.env.DB_Connection_String
 const tokenSecret = process.env.Token_Secret
 const smsConfig ={
   url:process.env.SMS_Url,
   token:process.env.SMS_Token,
   route:process.env.SMS_Route,
   flash:process.env.SMS_Flash
 }
 module.exports={
    DBConnectionString,
    tokenSecret,
    smsConfig
 }