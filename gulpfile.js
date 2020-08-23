const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
const fs = require("fs");
const path = require("path");
const imagemin = require("gulp-imagemin");
const pipeline = require("readable-stream").pipeline;
const del = require("del");

gulp.task("css", function (done) {
  console.log("minifying css...");
  gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest("./assets.css"));
  return pipeline(
    gulp.src("./assets/**/*.css"),
    cleanCSS(),
    rev(),
    gulp.dest("public/assets"),
    rev.manifest({
      base: "public/assets",
      merge: true,
    }),
    gulp.dest("./public/assets")
  );
});

gulp.task("js", function () {
  console.log("minifying js...");
  return pipeline(
    gulp.src("assets/**/*.js"),
    uglify(),
    rev(),
    gulp.dest("public/assets"),
    rev.manifest({
      base: "public/assets",
      merge: true,
    }),
    gulp.dest("./public/assets")
  );
});

gulp.task("images", function (done) {
  return pipeline(
    gulp.src("./assets/**/*.+(png|jpg|gif|svg|jpeg)"),
    // imagemin(),
    rev(),
    gulp.dest("public/assets"),
    rev.manifest({
      base: "public/assets",
      merge: true,
    }),
    gulp.dest("./public/assets")
  );
});

gulp.task("clean:assets", function (done) {
  console.log("Cleaning public assets...");
  del.sync("./public/assets");
  del.sync("./public/assets/rev-manifest.json");
  del.sync("./public/rev-manifest.json");
  done();
});

gulp.task("move-manifest", function (done) {
  fs.renameSync(
    path.join(__dirname, "rev-manifest.json"),
    path.join(__dirname, "./public/assets/rev-manifest.json"),
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log(
        path.join(__dirname, "rev-manifest.json"),
        path.join(__dirname, "public/assets/rev-manifest.json")
      );
      return;
    }
  );
  done();
});
gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images", "move-manifest"),
  function (done) {
    done();
  }
);
