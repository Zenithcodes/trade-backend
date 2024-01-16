import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import init from "../middleware/db";
import getSuggestionsModel from "../models/suggestions";
import { suggestionsValidator } from "../utils/validation";

const validate = (data: any) => {
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
const getStatus = (status: string) => {
  if (status) {
    return [status];
  }
  return ["open", "close"];
};
const badRequestResponse = () => ({
  status: 400,
  body: {
    messgae: "Bad request",
  },
});
const suggestions: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    if (true) {
      await init(context);
      const type = req.headers.type;
      if (type) {
        const model = getSuggestionsModel(type);
        context.log("handled");
        switch (req.method) {
          case "POST":
            const {
              name,
              buyPrice,
              targetPrice,
              stopLoss,
              description,
              video,
            }: any = req.body;
            const error = validate({
              type,
              name,
              buyPrice,
              stopLoss,
              targetPrice,
              video,
              description,
            });
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
                context.res = {
                  status: 200,
                  body: {
                    message: "success",
                    data: res,
                  },
                };
              } else {
                context.res = badRequestResponse();
              }
            } else {
              context.res = {
                status: 400,
                body: {
                  message: "Bad request",
                },
              };
            }
            break;
          case "GET":
            const { name: stockName, status,start,end } = req.query;
            const statusFilter = getStatus(status);
            if (stockName) {
              const result = await model.find({
                name: stockName,
                status: { $in: statusFilter},
                updatedAt:{
                    $gte:new Date(start).toISOString(),
                    $lte:new Date(end).toISOString()

                }
              }).sort({updatedAt:-1});
              context.res = {
                status: 200,
                body: {
                  data: result,
                },
              };
            } else {
              const result = await model.find({
                status: { $in: statusFilter },
                updatedAt:{
                    $gte:new Date(start).toISOString(),
                    $lte:new Date(end).toISOString()
                }
              }).sort({updatedAt:-1});
              context.res = {
                status: 200,
                body: {
                  data: result,
                },
              };
            }
            break;
          case "PUT":
            const {name:suggestionName,status:suggestionStatus,exitPrice} =req.body
            const record=await model.findOneAndUpdate({name:suggestionName,status:"open"},{status:suggestionStatus,exitPrice})
            if(!record){
                context.res={
                    status:200,
                   body:{
                    message:"record doesn't exist"
                   }
                }
            }else{
                context.res={
                    status:200,
                   body:{
                    data:record,
                    message:"updated record successfully"
                   }
                }
            }
            break;
        default:
            context.res=badRequestResponse()
            break;
        }
      } else {
        context.res = badRequestResponse();
      }
    } else {
      context.res = {
        status: 401,
        body: "User aunauthorized",
      };
    }
  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: "Internal server error",
    };
  }
};

export default suggestions;
