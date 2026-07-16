import Listing from "../models/listing.js";
import Review from "../models/reviews.js";

//post route
const createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.reviews); //create new revies
  //push in listing.reviews
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save(); //review store in review collections
  await listing.save(); //updatiing existing listing
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${req.params.id}`);
};


//delete route
const destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //reviews array me se ..jisse reviewid match ho jaye
    //use delete kr dege
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };
export default { createReview , destroyReview };
