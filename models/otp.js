const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    phoneNumber:{type:'string',unique:true,required:true},//login using otp
    otp:{type:'string',required:true},
    expiry:{type:'date',required:true}
})

const otp = mongoose.model('otp',otpSchema)
module.exports = otp