import Joi from "joi";

const categories = [
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
];

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required().max(200),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.array()
      .items(Joi.string().valid(...categories))
      .min(1)
      .max(4)
      .required(),
  }).required(),
});

const reviewsSchema = Joi.object({
  reviews: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

export { listingSchema, reviewsSchema };
