const { date } = require("joi"); // Importing date object from the 'joi' package
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the review schema
// const reviewSchema = new Schema({
//     Comment: String, // Comment field of type String
   
   
//     Rating: {
//         type: Number, // Rating field of type Number
//         min: 1, // Minimum value for rating
//         max: 5, // Maximum value for rating
//     }, // Rating field to represent a 1-5 rating system
//     createdAt: {
//         type: Date, // createdAt field of type Date
//         default: Date.now, // Default value is set to a function that returns the current timestamp when a review is created
//     },
//  });

// // Export the model using the review schema


// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;



// Define the review schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Reference to the User model
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'  // This refers to the 'User' model
    }
});

// Export the model using the review schema
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;


