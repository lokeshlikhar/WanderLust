import express from "express";
import wrapAsync from "../utils/wrapasync.js";
import { listingSchema, reviewsSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/reviews.js";
import Listing from "../models/listing.js";
import {isLoggedIn, validateReview , isReviewAuthor} from "../middleware.js";

//mvc
import reviewController from "../controllers/reviews.js"
//create router obj
const router = express.Router({mergeParams : true});

//post route
router.post(
  "",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

export default router;
