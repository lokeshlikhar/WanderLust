import mongoose from "mongoose";
const { Schema } = mongoose;
import Review from "./reviews.js";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: [
    {
      type: String,
      enum: [
        "Beach",
        "Mountain",
        "Camping",
        "Luxury",
        "Budget",
        "Nature",
        "City",
        "Lake",
        "Historical",
        "Adventure",
        "Island",
        "Farm Stay",
      ],
      required: true,
    },
  ],
});

//post middleware for if we delete listings ..its curresposnding reviews also get deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});
const Listing = new mongoose.model("Listing", listingSchema);

export default Listing;
