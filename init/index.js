const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wonderlust";
const MONGO_URL="mongodb+srv://aryanuttam786:OiXG32VnBBq631j5@cluster0.fa93nwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

main()
.then(() => {
    console.log("database is connected");
})
.catch((err) => {
    console.log("err");
});


async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async() =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was iniializezed");


}
initDB();
