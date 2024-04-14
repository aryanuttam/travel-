const express = require("express");
const router = express.Router();
var app = express();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("./middlerwares.js");
// const  saveRedirectUrl  = require("./routes/middlerwares.js");



router.get("/signup",(req,res)=>{
    res.render("listings/users/signup.ejs" );
});

// router.post("/signup", async(req,res)=>{
//     let{username,email,password} = req.body;
//     const newUser = new User({email,username});
//     const registeredUser = await User.register(newUser,password);
//     console.log(registeredUser);
//     req.flash("success","user was registered");
//     res.redirect('/listings');


// });


router.post("/signup", wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await User.register({ email, username }, password);
        console.log(newUser);
        req.login(newUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "User was registered successfully");
        res.redirect('/listings');
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to register user");
        res.redirect('/signup');
    }
}));


// Assuming you have already defined 'router' using express.Router()
router.get("/login",(req,res)=>{
    res.render("listings/users/login.ejs" );
});

router.post("/login", saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success" , "Welcome back to  Travel Buddy! ");
    let redirectUrl = res.locals.redirectUrl|| "/listings" ;
    res.redirect(redirectUrl);
});


router.get("/logout",(req,res, next)=>{
req.logout((err)=>{
    if(err){
      return  next(err);
    }
    req.flash( "success", "Logged out Successfully!");
    res.redirect("/listings");
})
});




module.exports= router;
