'use strict';

const gulp         = require('gulp');
const scss         = require('gulp-sass');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');
const sourcemaps   = require('gulp-sourcemaps'); 
const browserSync  = require('browser-sync').create();

const Paths = {
    HERE : './',
    SCSS : 'scss/**/**',
    CSS  : 'css'
};

// default
gulp.task('default', ['serve']);

// scss
gulp.task('scss', () => {

    return gulp.src(Paths.SCSS)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(sourcemaps.write(Paths.HERE))
        .pipe(gulp.dest(Paths.CSS))
        .pipe(browserSync.stream());

});

// watch and serve
gulp.task('serve', ['scss'], () => {

    browserSync.init({
        server : Paths.HERE  
    });

    gulp.watch([Paths.SCSS], ['scss']);
    gulp.watch(Paths.HERE + '/*.html').on('change', browserSync.reload);

});




