const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
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

  gulp
    .src("./assets/**/*.css")
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("public/assets"));
  done();
});

gulp.task("js", function () {
  console.log("minifying js...");
  return pipeline(
    gulp.src("assets/js/*.js"),
    uglify(),
    rev(),
    gulp.dest("public/assets/js"),
    rev.manifest({
      cwd: "public",
      merge: true,
    }),
    gulp.dest("public/assets")
  );
});

gulp.task("images", function (done) {
  gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("public/assets"));
  done();
});

gulp.task("clean:assets", function (done) {
  console.log("Cleaning public assets...");
  del.sync("./public/assets");
  del.sync("./public/assets/rev-manifest.json");
  del.sync("./public/rev-manifest.json");
  done();
});

gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    done();
  }
);
