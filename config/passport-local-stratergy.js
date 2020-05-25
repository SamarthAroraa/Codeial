const passport = require("passport");
const localStratergy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new localStratergy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error in finding user");
          return done(err);
        }
        if (!user || user.password != password) {
          console.log("username/password incorrect");
          return done(null, false);
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("error in finding user");
      return done(err, false);
    } else {
      return done(null, user);
    }
  });
});

/////////////////////////////////
//    check authentication     //
/////////////////////////////////

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie
    res.locals.user = req.user;
    // next();
  }
  return next();
};
