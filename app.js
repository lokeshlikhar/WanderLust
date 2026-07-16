import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import wrapAsync from "./utils/wrapasync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewsSchema } from "./schema.js";
import Review from "./models/reviews.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js"; //user model

const app = express();
const port = process.env.PORT || 8080;
app.engine("ejs", ejsmate);

//to build connection with db
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to DB");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

/* FIX for __dirname in ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* View Engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

/* Method Override for put and delete request */
app.use(methodOverride("_method"));

//connect-mongo for storing session
const store = MongoStore.create({
  mongoUrl: dbUrl, //storing as atlas db
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("error in mongo session store ", err);
});
//express session
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //one week later days , hrs , min , sec , minisecond
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption)); //its create a session id ..for any req(post,get)
app.use(flash());

//for user model ..after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//listing route .. import from route folder listing.js
app.use("/listings", listingRouter);

//review route ..using express route
app.use("/listings/:id/reviews", reviewRouter);

//user route
app.use("/", userRouter);

//home route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//for user who is accessing route which is not defined
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handle middleware
app.use((err, req, res, next) => {
  let {
    statusCode = 500,
    message = "something went wrong",
    name = "erro name",
  } = err; //deconstruct err
  res.status(statusCode).render("error.ejs", { message });
});

