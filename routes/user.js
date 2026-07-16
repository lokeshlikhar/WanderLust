import express from "express";
import User from "../models/user.js";
import wrapAsync from "../utils/wrapasync.js";
import passport from "passport";
import { saveRedirecturl } from "../middleware.js";

//mvc
import userController from "../controllers/user.js";
//create router obj
const router = express.Router();

// One shared information page for all footer links
router.get("/footer", (req, res) => {
  res.render("footer.ejs");
});

//signup
router.get("/signup", userController.renderSignUpForm);

//signup route
router.post("/signup", wrapAsync(userController.signUp));

//login
router.get("/login", userController.renderLogiInForm);

//user authencticate work automatically done by passport as a middleware
router.post(
  "/login",
  saveRedirecturl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login,
);

//logout
router.get("/logout",userController.logout );
export default router;
