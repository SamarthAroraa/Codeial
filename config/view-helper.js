const env = require("./environment");
const fs = require("fs");
const path = require("path");
module.exports = (app) => {
  app.locals.assetPath = (initialFilePath) => {
    console.log(
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../public/assets/rev-manifest.json")
        )
      )[initialFilePath]
    );
    if (env.name === "development") {
      return "/" + initialFilePath;
    }
    return (
      "/" +
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../public/assets/rev-manifest.json")
        )
      )[initialFilePath]
    );
  };
};
