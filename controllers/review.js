const Listing = require("../init/index")
const review = require("../models/review.js");

module.exports.newReview = async (req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);

    newreview.author = req.user._id;

    listing.review.push(newreview);
  

    await newreview.save();
    await listing.save();
    
    req.flash("success","New review is created");
    res.redirect(`/listing/${req.params.id}`)

}

module.exports.destroy = async(req,res,next)=>{
    const {id,reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {review : reviewid}});
    await review.findByIdAndDelete(reviewid);
    

    req.flash("success","Review deleted !");

    res.redirect(`/listing/${id}`)


};