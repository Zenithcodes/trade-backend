const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:'string',required:true},
    email:{type:'string',unique:true,required:true},
    phoneNumber:{type:'string',unique:true,required:true},
    consent:{type:'boolean',required:true},
    consentDate:{
        type:'date',
        default:new Date().toJSON()
    },
    subscriptionStart:{
        type: 'date',
        required:true
    },
    subscriptionEnd:{
        type: 'date',
        required:true
    },
    plan:{
        type: 'string',
        required:true
    },
    role:{
        type:"string",
        required:true,
        enum:["admin","user"],
        default:"user"
    },
})

const User = mongoose.model('user',userSchema)
module.exports=  User