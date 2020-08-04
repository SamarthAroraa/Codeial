const User = require("../models/user");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const queue = require("../config/kue");
const resetWorker = require("../workers/reset-password_worker");
const ResetPassword = require("../models/reset-password");
const randomString = require("randomstring");
const Friendship = require("../models/friendships");
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    let friendship = await Friendship.findOne({
      sender: req.user.id,
      reciever: user.id,
    });

    return res.render("user_profile", {
      title: `${user.name}`,
      profile_user: user,
      is_friend: friendship ? 1 : 0,
      self: req.user,
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
    req.flash("success", "Logged in Successfully!");
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
      req.flash("error", "User with this email id already exists");
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
  if (req.isAuthenticated()) {
    req.flash("success", "Logged in succesfully!");
    return res.redirect("/");
  } else {
    req.flash("error", "invalid username/password");
    return res.redirect("/users/sign-in");
  }
};

//sign out
module.exports.signOut = function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  req.flash("success", "Logged out");
  return res.redirect("/");
};

module.exports.updatePage = (req, res) => {
  if (req.params.id != req.user.id) {
    return res.render("ErrorPages/_access_forbidden", {
      title: "403 ACCESS FORBIDDEN!",
    });
  }
  return res.render("_user_profile_update", {
    title: "Profile Update",
    user: req.user,
  });
};
module.exports.update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findByIdAndUpdate(req.params.id, req.body);
      User.uploadedAvatar(req, res, async function (err) {
        req.flash("success", "Only images allowed");

        if (err) {
          console.log("***********Multer error!");
          req.flash("error", "An unexpected error occurred");
          return res.redirect("back");
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
              console.log(path.join(__dirname, "..", user.avatar));
            }
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
      });
      req.flash("success", "Profile Updated");
      return res.redirect("back");
    } catch (err) {
      console.log("error in uploading!", err);
    }
  } else {
    req.flash("error", "Unauthorized action");
    return res.status(401).send("Unauthorized");
  }

  return res.redirect("back");
};

module.exports.resetPassword = function (req, res) {
  return res.render("forgot_password", {
    title: "Forgot Password",
  });
};

module.exports.sendResetLink = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No users found.");
    return res.redirect("back");
  } else {
    let reset = await ResetPassword.create({
      user: user,
      isvalid: true,
      accessToken: randomString.generate(),
    });
    // console.log(reset, "**************************");
    let job = queue
      .create("ResetEmail", reset)
      .priority("high")
      .save(function (err) {
        if (err) {
          console.log("error in sending job to queue", err);
          return;
        }
      });
    console.log(job.id);
    req.flash("success", `Reset password link mailed to ${req.body.email}`);
  }
  //check if user exists in DB- if yes, flash message the reset email sent and carry on with the listed steps. If does not exist then flash "No users found" and return back
  //0) generate token
  //1)interpolate in the string to make the link
  //2)store reset link in mongo with validity(true), user(req.user), token(token)
  //3)send mail with reset link
  //4)return to render a view which informs that mail has been sent with reset instructions
  return res.redirect("back"); //TO BE CHANGED TO POINT 4'S VIEW
};

module.exports.resetPage = async function (req, res) {
  let token = req.params.token;
  let reset = await ResetPassword.findOne({ accessToken: token });
  if (!reset) {
    reset = null;
  }
  return res.render("change_pass", {
    title: "Set your new password",
    reset: reset,
  });
};

module.exports.changePassword = async function (req, res) {
  console.log("%%%%%%%", req.body);
  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("back");
  }
  let reset = await ResetPassword.findOne({
    accessToken: req.params.token,
  }).populate("user");
  if (!reset) {
    req.flash("error", "No user found!");
  } else {
    if (reset.isvalid) {
      const query = { email: reset.user.email };
      // Set some fields in that document
      const update = {
        $set: {
          password: req.body.password,
        },
      };

      await User.findOneAndUpdate(query, update);
      await ResetPassword.findOneAndUpdate(
        { accessToken: req.params.token },
        { isvalid: false }
      );
      req.flash("success", "Password updated successfully!");
      return res.redirect("/");
    } else {
      req.flash("error", "Session Expired!");
      return res.redirect("back");
    }
  }
};
