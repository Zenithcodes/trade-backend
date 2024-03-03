const useFetch = require("../services");
const { smsConfig } = require("../config");

const getEpochTime = (date = new Date()) => {
  return Math.floor(date.getTime() / 1000);
};
//  const hash=(plainText='',saltRounds=10)=>{
//    return  bcrypt.hash(plainText,saltRounds)
// }

// export const compareHash = (plaintext='',hash:any='')=>{
//     return bcrypt.compare(plaintext,hash)
// }
const generateOTP = (length=4) => {
  let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const calculateDates = (unit, value) => {
  const today = new Date();
  let endDate;
  switch (unit) {
    case "minutes":
      endDate = new Date(today.getTime() + value * 60 * 1000);
      break;
    case "days":
      endDate = new Date(today.getTime() + value * 24 * 60 * 60 * 1000);
      break;
    case "months":
      endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + value);
      break;
    case "years":
      endDate = new Date(
        today.getFullYear() + value,
        today.getMonth(),
        today.getDate()
      );
      break;
    default:
      throw new Error(
        'Invalid unit provided. Please use "minutes", "days", or "years".'
      );
  }

  return { startDate: today, endDate };
};



const sendSMS = async (number,value) => {
  const {url,token,route,flash} =smsConfig
  const config = {
    method: "get",
    url: `${url}?authorization=${token}&variables_values=${value}&route=${route}&numbers=${number}&flash=${flash}`
  };
  const response =await  useFetch(config);
  return response;
};

module.exports = {
  generateOTP,
  calculateDates,
  sendSMS
};
