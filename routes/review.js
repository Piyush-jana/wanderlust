const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const reviewSchema =require("../utils/reviewschema.js")
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn, isReviewAuthor} =require("../middleware.js");

const reviewController = require("../controllers/review.js")

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

//review create route
router.post("/",isLoggedIn,wrapAsync(reviewController.newReview))

//review delete 
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroy))

module.exports = router;
