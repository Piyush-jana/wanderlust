const User = require("../models/user");
const passport = require("passport");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.makingAccount = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "New User was Registered Successfully, Welcome to WanderLust")
        res.redirect("/listing")
    })
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginAccount = async(req,res)=>{
    req.flash("success"," Welcome back to WanderLust , User was Logged in successfully,");
    let redirectUrl = res.locals.redirectUrl||"/listing";
    res.redirect(redirectUrl);

};

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged Out Successfully");
        res.redirect("/listing");
    })

};