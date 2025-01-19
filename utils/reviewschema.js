const joi = require("joi");

const reviewSchema = joi.object({
    comment : joi.string().required(),
    rating : joi.number().required(),
    
})

module.exports = reviewSchema;