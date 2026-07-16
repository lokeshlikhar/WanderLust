import Listing from "../models/listing.js";

//for geocoding
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

//index route
const index = async (req, res) => {
  let allListing = await Listing.find({});
  res.redirect("listings/index.ejs", { allListing });
};

//new route
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//create listings
const createListing = async (req, res, next) => {
  //geocoding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListingdata = req.body.listing;
  const newListing = new Listing(newListingdata); //create new instance
  newListing.owner = req.user.id;

  //these is for cloudinary
  let url = req.file.path;
  let filename = req.file.filename;

  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry; //value from mapbox ..
  
  let savedListing = await newListing.save(); //saving it in db
  req.flash("success", "New listing Created!");

  res.redirect("/listings");
};

//show route
const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate is for showing reviews
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

//edit route
const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_250,w_350");
  res.render("listings/edit.ejs", { listing, originalUrl });
};

const updateListing = async (req, res) => {
  const { id } = req.params;

  // 1. Get the existing listing, including its old location and image.
  const listing = await Listing.findById(id);

  // 2. If location changed, get fresh Mapbox coordinates.
  if (listing.location !== req.body.listing.location) {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    listing.geometry = response.body.features[0].geometry;
  }

  // 3. Update normal form fields:
  // title, description, price, country, location, and category.
  Object.assign(listing, req.body.listing);

  // 4. Replace the image only when the user uploaded a new one.
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // 5. Save every changed field together.
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); //we can also print the deleted listing
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

//for search
const searchListing = async (req, res) => {
  const destination = req.query.destination.trim();

  // res.send(destination);
  //handle empty search
  if (!destination.trim()) {
    return res.redirect("/listings");
  }

  let listings = await Listing.find({
    location: {
      $regex: destination,
      $options: "i",
    },
  });
  if (listings.length === 0) {
    req.flash("error", `No Listings found for destination "${destination}"`);
    return res.redirect("/listings");
  }

  res.render("listings/search.ejs", { listings, destination });
};

const searchCategory = async (req,res)=>{
  const {category} = req.params;
  const listings = await Listing.find({
        category: category,
    });
  if (listings.length === 0) {
    req.flash("error", `No Listings found for destination "${category}"`);
    return res.redirect("/listings");
  }

  res.render("listings/category.ejs", { listings, category });

};
export default {
  index,
  renderNewForm,
  createListing,
  showListing,
  renderEditForm,
  updateListing,
  destroyListing,
  searchListing,
  searchCategory
};
