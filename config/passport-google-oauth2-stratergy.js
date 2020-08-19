const passport = require("passport");
const env = require("./environment");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");
const crypto = require("crypto");
const GOOGLE_CLIENT_ID =
  "588609195288-gndtmll483rji5ske2eb7qq248qfi2t3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "Qu6YEGlmfd99MViiB9dZcHuV";

//tell passport to use a new stratergy for user login via google
passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_callback_auth,
    },
    function (accessToken, refreshToken, profile, cb) {
      //find if user already exists
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google stratergy-passport", err);
          return;
        }
        console.log(profile);
        if (user) {
          //if found , set user to req.user via cb callback
          return cb(null, user);
        } else {
          //if user not found, create user and set user to req.user via cb callback
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user in  google stratergy-passport",
                  err
                );
                return;
              }
              return cb(null, user);
            }
          );
        }
      });
    }
  )
);
module.exports = passport;
