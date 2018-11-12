const gulp        = require('gulp');
const sass        = require('gulp-sass');
const plumber     = require('gulp-plumber');
const browsersync = require('browser-sync').create();
const sourcemaps  = require('gulp-sourcemaps');
const postcss     = require('gulp-postcss');
const rename      = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const cssnano     = require('cssnano');

// browserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// browserSyncReload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS Task
function css() {
  return gulp.src('./scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded"} ))
    .pipe(gulp.dest('./styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./styles'))
    .pipe(browsersync.stream())   
}

// watchFiles
function watchFiles() {
  gulp.watch('./scss/*.scss', css);
  gulp.watch('./*.html', browserSyncReload);
}

exports.dev = gulp.parallel(watchFiles, browserSync);