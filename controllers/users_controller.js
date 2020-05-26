const User = require("../models/user");
const Post = require("../models/post");

module.exports.profile = function (req, res) {
  res.render("user_profile", {
    title: "Your Profile",
  });
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
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    console.log("1");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user signing user in signing up.");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user in database");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

//sign in and create a session for he user
module.exports.createSession = function (req, res) {
  //todo later
  return res.redirect("/");
};

//sign out
module.exports.signOut = function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  return res.redirect("/");
};
