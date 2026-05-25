const Listing = require("./model/listing.js");
const Review = require("./model/review.js");
const ExpressError = require("./untils/ExpressError.js"); 
const { listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("success","you must be logged in to create a new listing");
        return res.redirect("/login");
     }
     next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Invalid listing id");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing no longer exists");
        return res.redirect("/listings");
    }

    const currentUserId = req.user?._id;
    if (!currentUserId || !listing.owner.equals(currentUserId)) {
        req.flash("error", "you are not the Owner of listing!");
        return res.redirect(`/listings/${id}`);
    }

    return next();
};

module.exports. validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);  
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
        req.flash("error", "Invalid review id");
        return res.redirect(`/listings/${id}`);
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review no longer exists");
        return res.redirect(`/listings/${id}`);
    }

    const currentUserId = req.user?._id;
    if (!currentUserId || !review.author.equals(currentUserId)) {
        req.flash("error", "you are not the author on this review!");
        return res.redirect(`/listings/${id}`);
    }

    return next();

};
