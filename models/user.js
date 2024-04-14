const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },  //password will be hashed by passport
    
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
