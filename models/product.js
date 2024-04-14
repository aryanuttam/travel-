const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    Name: String,
    marks: Number,
});


const product = mongoose.model('product', reviewSchema);

module.exports = product;