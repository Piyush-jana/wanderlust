const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user")

//signup
router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.makingAccount));

//login form
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}),userController.loginAccount);

//logout
router.get("/logout",userController.logout); 

module.exports = router;