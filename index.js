const express = require("express");
const app = express();
const port = 8000;

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Erro running server: ${err}`);
  } else {
    console.log(`Server running on port ${port}`);
  }
});
