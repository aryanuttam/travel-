const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Connect to MongoDB database using Mongoose.
const Listing = require( "./models/listing.js");
const path = require("path");
const exp = require("constants");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MongoStore = require('connect-mongo');
const { stringify } = require("querystring");
const Review = require('./models/review.js');
const { required } = require("joi");
const {reviewSchema} = require("./schema.js")
const passport = require("passport");
const { ppid } = require("process");
//const loaclStrategy = require("localStrategy");  // from the local-str
const user = require("./models/user.js");   // from users in server.js
const loaclStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const userRouter = require("./routes/user.js");
const { request } = require("http");
const {isLoggedIn} = require("./routes/middlerwares.js");


// const MONGO_URL ="mongodb://127.0.0.1:27017/wonderlust";

// const MONGO_URL ="mongodb+srv://aryanuttam786:VntgDTFX8xYkfEq0@travel.di7opxt.mongodb.net/?retryWrites=true&w=majority&appName=travel";
const MONGO_URL="mongodb+srv://aryanuttam786:OiXG32VnBBq631j5@cluster0.fa93nwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
main()
.then(() => {
    console.log("database is connected");
})
.catch((err) => {
    console.log("err");
});



 


async function main(){
    await mongoose.connect(MONGO_URL );
};

app.set("views", path.join(__dirname, "views"));

app.set("view engine " ,"ejs" );
app.set("views" ,path.join(__dirname, 'views') );
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join( __dirname,'public')));




app.get("/" , (req,res) =>{
    console.log("Hi I am root");
});

const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el) => el.message ).join(", ");
    throw new ExpressError(400,errMsg);}
    else{
        next();
    }
};

const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto:{
        secret:'your-secret-key'
    },
    touchAfter: 24*36,

});

store.on("error",()=>{
    console.log("Error in mongo session store " , err);
});


const sessionOptions = {
    store,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
};



// Use session middleware with the provided options
app.use(session(sessionOptions));

//  app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new loaclStrategy( user.authenticate() ));


app.use((req, res, next) => {
    // Set local variables for success and error flash messages
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // Set local variable for the current authenticated user
    res.locals.currUser = req.user;

    // console.log(req.user)

    // Call the next middleware in the chain
    next();
});


passport.serializeUser(user.serializeUser() );
passport.deserializeUser(user.deserializeUser() );

app.use("/" , userRouter);





// Index Route
app.get("/listings" , wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings} );
    }));


// New Route
     app.get("/listings/new"  , isLoggedIn, (req,res)=>{
   
     res.render("listings/new.ejs");
     });


     //review
     




 //show Route


app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    // Use populate to include reviews with the listing
    const listing = await Listing.findById(id).populate("reviews");
    // console.log(listing.reviews);
    
    res.render("listings/show.ejs", { listing });
}));





 // Create Route 
  app.post("/listings" , isLoggedIn, wrapAsync( async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    const {title,description,price,location,country} = req.body.listing;
    const image = req.body.listing.image;
   
    
    const newListing = new Listing({
        title, description, price, location, country, image
    });
    
    await newListing.save();
    req.flash("success" ,"new listing is created!");
    res.redirect(`/listings/${newListing._id}`);
    // res.redirect(`/listings/${Listing._id}`)
    // res.redirect("/listings");
   
   //let listing = req.body.listing;
   //console.log(listing);

 }));


 // edit Route 
 app.get("/listing/:id/edit" , isLoggedIn,wrapAsync( async (req,res)=>{
    
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success" ," listing is edited!");
    res.render("listings/edit.ejs" ,{listing} );

 }));

 //updade Route
 app.put("/listing/:id",  isLoggedIn, wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success" ," listing is edited!");
    res.redirect(`/listings/${id}`);

 }));

 //Delte Route
 app.delete("/listing/:id", isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success" ,"listing was deleted!");
    console.log(deleteListing);
    res.redirect("/listings");
    
 }));


// Review Route
 //post Route


app.post("/listings/listing/:id" , validateReview, wrapAsync( async ( req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(req.body.review);
    
     listing.reviews.push(newReview);
    //  console.log(newReview);

     await newReview.save();
     await listing.save();
     res.redirect(`/listings/${listing._id}`);
 }));

 //delet review Route


app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // Step 1: Remove the reviewId from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Step 2: Delete the review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect the user back to the listing details page
    res.redirect(`/listings/${id}`);
}));



 

 app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
    
 });


 app.use((err,req ,res,next)=>{

    let{statusCode=500 , message ="something went wrong!"} = err;
    res.status(statusCode).render("listings/Error.ejs" , {message});
    //res.status(statusCode).send(message);
 });



app.listen(3000 , ()=>{
    console.log("server is listening to prot 3000");
});