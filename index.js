const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/view-helper")(app);

const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const env = require("./config/environment");
const db = require("./config/mongoose");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const passportLocal = require("./config/passport-local-stratergy");
const passportGoogle = require("./config/passport-google-oauth2-stratergy");
const passportJWT = require("./config/passport-jwt-stratergy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
const path = require("path");

app.use(logger(env.morgan.mode, env.morgan.options));

chatServer.listen(80, function (err) {
  if (err) {
    return;
  }
  console.log("chat server running on port 80");
});

if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
//make the upload path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
  session({
    name: "codial",
    //TO DO change secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    require: false,
    cookie: {
      maxAge: 60 * 1000 * 100,
    },

    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mogodb ok");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error running server: ${err}`);
  } else {
    console.log(`Server running on port ${port}`);
  }
});
