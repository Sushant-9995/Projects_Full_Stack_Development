const listing=require("../models/listing");
const  Review=require("../models/review");


module.exports.createReview=async(req,res)=>{
    let listing1=await listing.findById(req.params.id);
    let newReview=await Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing1.reviews.push(newReview);

    await newReview.save();
    await listing1.save();

    // console.log("New Review saved");
    // res.send("New Review saved");
    req.flash("success"," New Review Created!");
    res.redirect(`/listings/${listing1._id}`);

};

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`);
};