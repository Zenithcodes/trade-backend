import Joi = require("joi");

export const suggestionsValidator=Joi.object().keys({
    name:Joi.string().required(),
    targetPrice:Joi.number().required(),
    buyPrice:Joi.number().required(),
    stopLoss:Joi.number().required(),
    type:Joi.string().required(),
    video:Joi.string(),
    description:Joi.string()
})