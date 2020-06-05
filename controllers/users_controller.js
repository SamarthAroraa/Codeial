const User = require("../models/user");
const Post = require("../models/post");

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "Your Profile",
      profile_user: user,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unexpected error!");

    return res.redirect("back");
  }
};

//render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  } else {
    res.render("user_sign_up", {
      title: "Codeial | Sign-up",
    });
  }
};
//render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  } else {
    res.render("user_sign_in", {
      title: "Codeial|Sign-in",
    });
  }
};

//create a new user
module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      console.log("1");
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      let user = await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      flash.error("error", "User with this email id already exists");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Unexpected error!");

    return res.redirect("back");
  }
};

//sign in and create a session for he user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in succesfully!");
  return res.redirect("/");
};

//sign out
module.exports.signOut = function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  req.flash("success", "Logged out");
  return res.redirect("/");
};

module.exports.update = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      let user = await User.findByIdAndUpdate(req.params.id, req.body);
    } else {
      req.flash("error", "Unauthorized action");
      return res.status(401).send("Unauthorized");
    }
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error", "Unexpected error!");

    return res.redirect("back");
  }
};
