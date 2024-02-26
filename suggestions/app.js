const  {init} = require("../middleware/db");
const  {getSuggestionsModel} =require( "../models");
const { suggestionsValidator } =require( "../utils/validation");
const {badRequestResponse,unAuthorizedResponse} =require('../utils/constants')

const validate = (data) => {
  const { stopLoss, buyPrice, targetPrice } = data;
  const { error } = suggestionsValidator.validate(data);
  if (error) {
    return error;
  }
  if (stopLoss > buyPrice || buyPrice > targetPrice) {
    return "Invalid Data";
  }
  return undefined;
};
const getStatus = (status) => {
  if (status) {
    return [status];
  }
  return ["open", "close"];
};


const getDateFilters=(start,end,type)=>{
  if(start && end){
    return {
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString()
    }
  }
  const date = new Date()
  if(type==="intraday"){
    date.setHours(0,0,0,0)
    return {
      startDate: date.toISOString(),
      endDate:  new Date().toISOString()
    }
  }
  const month = date.getMonth()
  date.setMonth(month-2)
  return {
      startDate: date.toISOString(),
      endDate:  new Date().toISOString()
    }
}
let response
exports.lambdaHandler =async (event,context)=> {
    console.log(event)
    const {headers,httpMethod,queryStringParameters,body} = event
  try {
    if (true) {
      await init();
      const type = headers.Type;
      if (type) {
        const model = getSuggestionsModel(type);
        switch (httpMethod) {
          case "POST":
            const {
              name,
              buyPrice,
              targetPrice,
              stopLoss,
              description,
              video,
            } = JSON.parse(body);
            const error = validate({
              type,
              name,
              buyPrice,
              stopLoss,
              targetPrice,
              video,
              description,
            });
            console.log(error)
            if (!error) {
              const isSuggestionExist = await model.findOne({
                name,
                status: "open",
              });
              if (!isSuggestionExist) {
                const fields = {
                  name,
                  buyPrice,
                  targetPrice,
                  stopLoss,
                  description,
                  video,
                  createdBy: "admin",
                  updatedBy: "admin",
                };
                const suggestions = new model(fields);
                const res = await suggestions.save();
                response = {
                  statusCode: 200,
                  body:JSON.stringify( {
                    message: "success",
                    data: res,
                  }),
                };
              } else {
                response = {
                    statusCode:403,
                    body:JSON.stringify({message:"record already exists"})
                };
              }
            } else {
             response=badRequestResponse
            }
            break;
          case "GET":
            const { name: stockName, status,start,end } = queryStringParameters || {};
            const statusFilter = getStatus(status);
            const {startDate,endDate} = getDateFilters(start,end,type)
            console.log(statusFilter,model,startDate,endDate,stockName)
            if (stockName) {
              const result = await model.find({
                name: stockName,
                status: { $in: statusFilter},
                updatedAt:{
                    $gte:startDate,
                    $lte:endDate

                }
              }).sort({updatedAt:-1});
              response = {
                statusCode: 200,
                body: JSON.stringify({
                    data: result,
                  }),
              };
            } else {
              const result = await model.find({
                status: { $in: statusFilter },
                updatedAt:{
                    $gte:startDate,
                    $lte:endDate
                }
              }).sort({updatedAt:-1});
              response = {
                statusCode: 200,
                body: JSON.stringify({
                    data: result,
                  }),
              };
            }
            break;
          case "PUT":
            const {name:suggestionName,status:suggestionStatus,exitPrice} =JSON.parse(body)
            const record=await model.findOneAndUpdate({name:suggestionName,status:"open"},{status:suggestionStatus,exitPrice})
            if(!record){
                response={
                    statusCode:200,
                   body:JSON.stringify({
                    message:"record doesn't exist"
                   })
                }
            }else{
                response={
                    statusCode:200,
                   body:JSON.stringify({
                    data:record,
                    message:"updated record successfully"
                   })
                }
            }
            break;
        default:
            response=badRequestResponse
            break;
        }
      } else {
        response = badRequestResponse;
      }
    } else {
      response = unAuthorizedResponse
    }
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({message:"Internal server error"}),
    };
  }
  return response
};