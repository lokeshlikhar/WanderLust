import User from "../models/user.js";

//rendersignupform
const renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

//signup
const signUp = async (req, res, next) => {
  //we want any error occur flash should come and redirect to signup page
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ username, email });
    const registeredUser = await User.register(newuser, password);
    req.login(registeredUser, (err) => {
      //automatically logged in when signup
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//renderloginform
const renderLogiInForm = (req, res) => {
  res.render("users/login.ejs");
};

//login
const login = async (req, res) => {
  req.flash("success", "welcome back to WanderLust!");

  let redirectUrl = res.locals.redirectUrl || "/listings"; //if redirecturl present ..otherwise "/listings"
  res.redirect(redirectUrl);
};

//logout
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you logged out");
    res.redirect("/listings");
  });
}; 
export default { renderSignUpForm, signUp, renderLogiInForm, login  , logout};
