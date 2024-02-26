const { init } = require("../middleware/db");
const { otpModel, userModel } = require("../models");
const { mobileNumberValidator } = require("../utils/validation");
const { generateOTP, calculateDates } = require("../utils/utils");
const { unAuthorizedResponse, badRequestResponse } = "../utils/constants";
let response;
exports.lambdaHandler = async (event, context) => {
  try {
    await init();
    const { body, httpMethod, queryStringParameters, resource } = event;
    switch (httpMethod) {
      case "GET":
        const { phoneNumber } = queryStringParameters;
        if (mobileNumberValidator.test(phoneNumber)) {
          const otp = generateOTP();
          const { endDate } = calculateDates("minutes", 10);
          const isUserExist = await userModel.findOne({ phoneNumber });
          console.log(isUserExist);
          await otpModel.findOneAndUpdate(
            { mobileNumber: phoneNumber },
            { mobileNumber: phoneNumber, otp, expiry: endDate },
            { upsert: true, new: true }
          );
          response = {
            statusCode: 200,
            body: JSON.stringify({
              message: "success",
              otp,
            }),
          };
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
        } else if (resource === "/register") {
          if (true) {
            const { phoneNumber, email, name, consent } = JSON.parse(body);
            const isUserExist = await userModel.findOne({ phoneNumber });
            const { startDate, endDate } = calculateDates("months", 1);
            console.log('entered',resource,isUserExist)
            if (!isUserExist) {
                const fields ={
                    phoneNumber,
                    name,
                    email,
                    consent,
                    plan: "free",
                    subscriptionStart: startDate,
                    subscriptionEnd: endDate,
                }
              const user = new userModel(fields);
              const res = await user.save();
              console.log(res)
              response = {
                statusCode: 200,
                body:JSON.stringify( {
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
        response = {
          statusCode: 400,
          body: JSON.stringify({
            messgae: "Bad request",
          }),
        };
    }
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};
