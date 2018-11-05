'use strict';
/**************
1. Dependancies
**************/

const gulp         = require("gulp"),                   // gulp core
		  imagemin     = require("gulp-imagemin"),          // compress images
		  sass         = require("gulp-sass"),              // sass compiler
		  minifycss    = require("gulp-minify-css"),        // minify css
		  uglify       = require("gulp-uglify"),            // uglifies the js
      jshint       = require("gulp-jshint"),            // check if js is ok
      concat       = require("gulp-concat"),            // concatinate js
      notify       = require("gulp-notify"),            // send notifcations to osx
      plumber      = require("gulp-plumber"),           // disable interuption
      stylish      = require("jshint-stylish"),         // make errors look good in shell
      browserSync  = require("browser-sync").create(),  // inject code to all devices
      autoprefixer = require("gulp-autoprefixer");      // sets missing browserprefixes

/*******************
2. File Destinations
*******************/

let target = {
// development dir
src: {
  html: "src/**/*.html",      // all html files
  sass: "src/sass/**/*.sass", // all sass files
  js:   "src/js/**/*.js",     // all js files
  img:  "src/img/*"
},
// distribution dir (output files)
dist: {
  html: "dist",     // where to put html files
  css:  "dist/css", // where to put minified css
  js:   "dist/js",  // where to put minified js
  img:  "dist/img"  // where to put copressed images
}
};


/***********
3. SASS Task
************/

gulp.task("sass", () => {
gulp.src(target.src.sass) // get the files
  .pipe(plumber())        // make gulp keeps running on errors
  .pipe(sass())           // compile all sass
  .pipe(autoprefixer(     // complete css with correct vendor prefixes
	"last 2 version",
	"> 1%",
	"ie 8",
	"ie 9",
	"ios 6",
	"android 4"
  ))
  .pipe(minifycss())                            // minify css
  .pipe(gulp.dest(target.dist.css))             // where to put the file
  .pipe(notify({ message: "SASS processed!" })); // notify when done
});

/**********
4. JS Tasks
**********/

// lint my custom js
gulp.task("js-lint", () => {
gulp.src(target.src.js)            // get the files
  .pipe(jshint())                  // lint the files
  .pipe(jshint.reporter(stylish)); // present the result in a beatiful way
});

// minify & concatinate js
gulp.task("js-concat", () => {
gulp.src(target.src.js)                         // get the files
  .pipe(uglify())                               // uglify the files
  .pipe(concat("scripts.min.js"))               // concatinate to one file
  .pipe(gulp.dest(target.dist.js))              // where to put files
  .pipe(notify({ message: "JS processed!" }));  // notify when done
});

/************
5. Image Task
************/
gulp.task("imagemin", () => {
gulp.src(target.src.img)             // get the files
  .pipe(imagemin())                  // compress the images
  .pipe(gulp.dest(target.dist.img)); // where to put the images
});

/***********
6. HTML Task
***********/

gulp.task("copyHtml", () => {
gulp.src(target.src.html)             // get the files
  .pipe(gulp.dest(target.dist.html))  // where to put the html
  .pipe(notify({ message: "HTML processed!" }));
});

/************
1. Gulp Tasks
************/

gulp.task("default", () => {

// initialize server
browserSync.init(["dist/*.html", "dist/css/*.css", "dist/js/*.js"], { // files to inject
  server: "dist" // development server dir
});

// watch & reload
gulp.watch("src/**/*.html", ["copyHtml"]);
gulp.watch("src/sass/**/*.sass", ["sass"]);

// lint and concat js
gulp.watch("src/js/**/*.js", ["js-lint", "js-concat"]);
});