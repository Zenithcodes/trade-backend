const mongoose = require('mongoose')
const Schema=mongoose.Schema;
const suggestionsSchema=new Schema({
    name:{
        type:"string",
        require:true
    },
    targetPrice:{
        type:"number",
        require:true,
    },
    stopLoss:{
        type:"number",
        require:true
    },
    buyPrice:{
        type:"number",
        required:true
    },
    exitPrice:{
        type:"number"
    },
    description:{
        type:"string"
    },
    video:{
        type:"string"
    },
    status:{
        type:"string",
        enum:["open","close","delete"],
        default:"open"
    },
    createdAt: {
        type: "date",
        require: true,
        default: new Date().toJSON(),
      },
      createdBy: {
        type: "string",
        require: true,
      },
      updatedAt: {
        type: "date",
        require: true,
        default: new Date().toJSON(),
      },
      updatedBy:{
        type:"string",
        required:true
      }
})

const getSuggestionsModel= (type)=>{
    return mongoose.model(type,suggestionsSchema)
}

module.exports= getSuggestionsModel;