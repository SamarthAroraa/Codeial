/////////////////////////////////////////////////
//              setting the db                 //
/////////////////////////////////////////////////

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/codeial_dev");
const db = mongoose.connection;

//unsuccessful connection
db.on(
  "error",
  console.error.bind(console, "Error establishing connection to the database")
);

//successful connection
db.once("open", function () {
  console.log("Connected to the Database::MongoDB");
});

module.exports = db;
