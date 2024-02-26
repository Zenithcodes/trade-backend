const Joi = require("joi");

const suggestionsValidator=Joi.object().keys({
    name:Joi.string().required(),
    targetPrice:Joi.number().required(),
    buyPrice:Joi.number().required(),
    stopLoss:Joi.number().required(),
    type:Joi.string().required(),
    video:Joi.string(),
    description:Joi.string()
})

const usersValidator = Joi.object().keys({
    name:Joi.string().required(),
    email:Joi.string().required(),
    mobileNumber:Joi.string().required(),
    consent:Joi.boolean().required(),
    mpin:Joi.string().length(4).required()
})

const mobileNumberValidator = /^(\+91[\-\s]?)?[0]?[789]\d{9}$/

module.exports={
    suggestionsValidator,
    usersValidator,
    mobileNumberValidator
}