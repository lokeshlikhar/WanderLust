import Listing from "./models/listing.js";
import { listingSchema, reviewsSchema } from "./schema.js";
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/reviews.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};

const saveRedirecturl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
const validateListing = (req, res, next) => {

  // Convert single category to array
  if (
    req.body.listing &&
    req.body.listing.category &&
    !Array.isArray(req.body.listing.category)
  ) {
    req.body.listing.category = [req.body.listing.category];
  }

  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    req.flash("error", errMsg);
    return res.redirect("/listings/new");
  }

  next();
};

//validate review
const validateReview = (req, res, next) => {
  let { error } = reviewsSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//authorization for listing
const isOwner = async (req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser.id)){
      req.flash("error" , "You are not owner of these listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
//authorization for review author
const isReviewAuthor = async (req,res,next)=>{
  let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currUser.id)){
      req.flash("error" , "You did not create these review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
export {isLoggedIn , saveRedirecturl , isOwner , validateListing , validateReview , isReviewAuthor};
