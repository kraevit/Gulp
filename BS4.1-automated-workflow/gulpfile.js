"use strict";

// Load plugins
const { src, dest, watch, series, parallel } = require("gulp");
const browsersync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS Task
function css() {
  return src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))

    .pipe(dest("./styles"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss( [autoprefixer(), cssnano()] ))
    .pipe(sourcemaps.write())
    .pipe(dest("./styles"))
    .pipe(browsersync.stream())
}

// Watch files
function watchFiles() {
  watch("./scss/*.scss", css);
  watch("./*.html", browserSyncReload);
}

// build

// develop
exports.dev = parallel(watchFiles, browserSync);