const { tokenSecret } = require( '../config');

const getEpochTime=(date=new Date())=>{
    return Math.floor(date.getTime()/1000)
}
 const hash=(plainText='',saltRounds=10)=>{
   return  bcrypt.hash(plainText,saltRounds)
}

// export const compareHash = (plaintext='',hash:any='')=>{
//     return bcrypt.compare(plaintext,hash)
// }
 const generateOTP=()=>{
    let digits = '0123456789abcdefghijklmnopqrstuvwxyz';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
}


const calculateDates=(unit,value)=>{
    const today = new Date();
    let endDate;
    switch (unit) {
        case 'minutes':
            endDate = new Date(today.getTime() + value * 60 * 1000);
            break;
        case 'days':
            endDate = new Date(today.getTime() + value * 24 * 60 * 60 * 1000);
            break;
        case 'months':
            endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + value);
            break;
        case 'years':
            endDate = new Date(today.getFullYear() + value, today.getMonth(), today.getDate());
            break;
        default:
            throw new Error('Invalid unit provided. Please use "minutes", "days", or "years".');
    }

    return { startDate: today, endDate };
}
// export const signToken = (payload = {}, expiresIn = "1h") => {
//     try {
//       const accessTokenSecret = tokenSecret || "private";
//       const accessToken = jwt.sign(payload, accessTokenSecret, {
//         expiresIn,
//         algorithm: "HS256",
//       });
//       console.log(accessToken,accessTokenSecret)
//       return accessToken;
//     } catch (err) {
//         console.log(err)
//       return null;
//     }
//   };

module.exports={
  generateOTP,
  calculateDates
}