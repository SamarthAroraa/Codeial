const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory || fs.mkdirSync(logDirectory));

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "asifhajosicrh89w34u9rjixp3purhw3oir",
  db: "codeial_dev",
  google_client_id:
    "588609195288-gndtmll483rji5ske2eb7qq248qfi2t3.apps.googleusercontent.com",
  google_client_secret: "Qu6YEGlmfd99MViiB9dZcHuV",
  google_callback_auth: "http://localhost:3000/users/auth/google/callback",
  jwt_secret_key: "rsj091203sgj",
  smtp: {
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "teamcodeial",
      pass: "pack6:ICU",
    },
  },
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};
const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_callback_auth: process.env.CODEIAL_GOOGLE_CALLBACK_AUTH,
  jwt_secret_key: process.env.CODEIAL_JWT_SECRET,
  smtp: {
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_MAILER_AUTH_USERNAME,
      pass: process.env.CODEIAL_MAILER_AUTH_PASS,
    },
  },
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports =
  eval(process.env.NODE_ENV) == undefined
    ? development
    : eval(process.env.NODE_ENV);
