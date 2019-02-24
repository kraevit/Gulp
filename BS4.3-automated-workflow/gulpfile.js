"use strict";

// Load plugins

let gulp, browserSync, sourceMaps, sass, plumber, postCss, rename, autoPrefixer, cssNano, pug; 

gulp         = require("gulp");
browserSync  = require("browser-sync").create();
sourceMaps   = require("gulp-sourceMaps");
sass         = require("gulp-sass");
plumber      = require("gulp-plumber");
postCss      = require("gulp-postCss");
rename       = require("gulp-rename");
autoPrefixer = require("autoPrefixer");
cssNano      = require("cssnano");
pug          = require("gulp-pug");

// BrowserSync
function browserSyncFn(done) {
	browserSync.init({
		server: {
			baseDir: ["./", "./build"],
			routes: {
				'/vendor' : './node_modules'
			}
		}
	});
	done();
}

// BrowserSync reload
function browserSyncReloadFn(done) {
	browserSync.reload();
	done();
}

// HTML Task
function html() {
	return gulp.src("./src/*.pug")
	.pipe(plumber())
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest("./build"));
}

// CSS Task
function css() {
	return gulp.src("./src/scss/all.scss")
	.pipe(sourceMaps.init())
	.pipe(plumber())
	.pipe(sass({ outputStyle: "expanded" }))
	.pipe(gulp.dest("./build/css"))
	.pipe(browserSync.stream())
	.pipe(rename({ suffix: ".min" }))
	.pipe(postCss( [autoPrefixer(), cssNano()] ))
	.pipe(sourceMaps.write())
	.pipe(gulp.dest("./build/css"));
}

// Watch files
function watchFiles() {
	gulp.watch("./src/scss/**/*.scss", css);
	gulp.watch("./src/**/*.pug", html);
	gulp.watch("./build/*.html", browserSyncReloadFn);
}

// build

// develop
exports.dev = gulp.parallel(watchFiles, browserSyncFn);