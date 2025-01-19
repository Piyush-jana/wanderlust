const Listing = require("./init/index");
const review = require("./models/review");
const {listingSchema } = require("./utils/schema.js");
const ExpressError = require("./utils/ExpressError.js");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in for creating listing, LOGIN FIRST");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
       
    }
    next();
   
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("success","PERMISSION DENIED : you are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();

}
module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id , reviewid} = req.params;
    let Review = await review.findById(reviewid);
    if(!Review.author.equals(res.locals.currUser._id)){
        req.flash("success","PERMISSION DENIED : you are not the owner of this Review");
        return res.redirect(`/listing/${id}`);
    }
    next();

}