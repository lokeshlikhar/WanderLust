import express from "express";
import wrapAsync from "../utils/wrapasync.js";
import { listingSchema, reviewsSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";

//mvc
import listingController from "../controllers/listings.js";
//for parssing multipartdata
import multer from "multer";
//cloadinary for images storage
import { storage } from "../cloudConfig.js";

//for only png , jpg , jpeg images not file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPG, JPEG and PNG images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});


const router = express.Router();


//1st index route to get all listings
router.get("/", wrapAsync(listingController.index));

//search route
router.get("/search",wrapAsync(listingController.searchListing));

//new listing render form
router.get("/new", isLoggedIn, listingController.renderNewForm);
//post listing
router.post("/", isLoggedIn, (req, res, next) => {
  upload.single("listing[image]")(req, res, function (err) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/listings/new");
    }

    next();
  });
},
validateListing,
wrapAsync(listingController.createListing)
);

//filter route
router.get("/category/:category",wrapAsync(listingController.searchCategory) );


//show route ..to show individual listing in detail
router.get("/:id", wrapAsync(listingController.showListing));

//route for edit and update
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner, //phle logged in then isowner to update
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing),
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);
export default router;
