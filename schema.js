// const Joi = require( "joi");

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating:Joi.number().required().min(1).max(5),
//         Comment:Joi.string().required(),

//     }).required()
// });

const Joi = require("joi");

// Define the Joi schema for review validation
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports = {
    reviewSchema
};

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//        rating: Joi.number().required(), 
//        body:  Joi.string().required()
//    })
 
//   })