const { init } = require("../middleware/db");
const { otpModel, userModel } = require("../models");
const { mobileNumberValidator } = require("../utils/validation");
const { generateOTP, calculateDates, sendSMS } = require("../utils/utils");
const { unAuthorizedResponse, badRequestResponse } = require("../utils/constants");
const {signToken,verifyToken,extractToken} = require('../middleware/auth')
let response;
exports.lambdaHandler = async (event, context) => {
  try {
    await init();
    const { body, httpMethod, queryStringParameters, resource,headers } = event;
    const token = extractToken(headers)
    switch (httpMethod) {
      case "GET":
        const { phoneNumber } = queryStringParameters;
        if (mobileNumberValidator.test(phoneNumber)) {
          const otp = generateOTP();
          const { endDate } = calculateDates("minutes", 10);
          const res=await sendSMS(phoneNumber,otp)
         if(res.return){
          await otpModel.findOneAndUpdate(
            { phoneNumber },
            { phoneNumber, otp, expiry: endDate },
            { upsert: true, new: true }
          );
          response = {
            statusCode: 200,
            body: JSON.stringify({
              message: "success",
              otp,
            }),
          };
         }else{
          response={
            statusCode:400,
            body: JSON.stringify({
              message: 'error sending otp'
            })
          }
         }
        } else {
          response = {
            statusCode: 400,
            body: JSON.stringify({
              message: "Please enter valid mobile number",
            }),
          };
        }
        break;
      case "POST":
        if (resource === "/submit-otp") {
        const date = new Date()
          const { phoneNumber, otp } = JSON.parse(body);
          const record = await otpModel.findOne({ phoneNumber, otp });
          if (record && date < new Date(record?.expiry)) {
            const isUserExist = await userModel.findOne({ phoneNumber });
            expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
            const { startDate, endDate } = calculateDates("months", 1);
            const payload={
              phoneNumber,
              plan:isUserExist?.plan || 'free',
              subscriptionStart: isUserExist?.subscriptionStart || startDate,
              subscriptionEnd: isUserExist?.subscriptionEnd || endDate
            }
            const accessToken = signToken(payload,'30d')
            await otpModel.findByIdAndUpdate(record._id,{expiry: date.toISOString()})
            response = {
              statusCode: 200,
              body: JSON.stringify({
                message: "success",
                accessToken,
                expiresIn:expiry,
                isNewUser: isUserExist?false : true
              }),
            };
          } else {
            response = {
              statusCode: 401,
              body: JSON.stringify({ message: "Invalid otp" }),
            };
          }
        } else if (resource === "/register") {
          if (verifyToken(token)?.isValid) {
            const { phoneNumber, email, name, consent } = JSON.parse(body);
            const isUserExist = await userModel.findOne({ phoneNumber });
            const { startDate, endDate } = calculateDates("months", 1);
            if (!isUserExist) {
              const fields = {
                phoneNumber,
                name,
                email,
                consent,
                plan: "free",
                subscriptionStart: startDate,
                subscriptionEnd: endDate,
              };
              const user = new userModel(fields);
              const res = await user.save();
              response = {
                statusCode: 200,
                body: JSON.stringify({
                  message: "user registered successfully",
                  data: res,
                }),
              };
            } else {
              response = {
                statusCode: 403,
                body: JSON.stringify({ message: "user already exists" }),
              };
            }
          } else {
            response = unAuthorizedResponse;
          }
        } else {
          response = badRequestResponse;
        }

        break;
      default:
        response = badRequestResponse;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};
