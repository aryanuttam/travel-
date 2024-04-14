const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a listing
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        
        type:String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
// Create the Listing model using the listingSchema
const Listing = mongoose.model("Listing", listingSchema);

// Export the Listing model
module.exports = Listing;
