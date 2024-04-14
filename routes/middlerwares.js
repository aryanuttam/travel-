module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ 
        req.session.redirectUrl= req.originalUrl; //store the original url to redirect after login
        req.flash("error", "you must be login to create listing ");
        return res.redirect("/login");
       
    }
    next();

};


module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

};