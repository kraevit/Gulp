const { src, dest } = require("gulp");                  // gulp core
const browsersync   = require("browser-sync").create(); // live reload
const fileinclude   = require("gulp-file-include");     // html templating engine
const del           = require("del");                   // delete files
const rename        = require("gulp-rename");           // rename files
const sass          = require("gulp-sass");             // sass compiler
const autoprefixer  = require("gulp-autoprefixer");     // css autoprefixer
const clean_css     = require("gulp-clean-css");        // css minifier
const sourcemaps    = require("gulp-sourcemaps");       // maps
const uglify        = require("gulp-uglify-es");        // js minifier
const babel         = require("gulp-babel");            // js es6 support
const imagemin      = require("gulp-imagemin");         // image compression
const webp          = require("gulp-webp");             // webp image formats
const webphtml      = require("gulp-webp-html");        // auto insert webp tags in html
const webpcss       = require("gulp-webp-css");         // auto insert webp in css
const svgSrite      = require("gulp-svg-sprite");       // svg sprites
const ttf2woff      = require("gulp-ttf2woff");         // fonts
const ttf2woff2     = require("gulp-ttf2woff2");        // fonts
const fonter        = require("gulp-fonter");           // fonts

let source_folder   = "source"; // source folder
let build_folder    = "build";   // build folder

let path = {
  source: {
    html:   [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    scss:   source_folder + "/scss/",
    js:     source_folder + "/js/",
    img:    source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts:  source_folder + "/fonts/*.ttf"
  },
  build: {
    html:   build_folder + "/",
    css:    build_folder + "/css/",
    js:     build_folder + "/js/",
    img:    build_folder + "/img/",
    fonts:  build_folder + "/fonts/"
  },
  watch: {
    html:   source_folder + "/**/*.html",
    scss:   source_folder + "/scss/**/*.scss",
    js:     source_folder + "/js/**/*.js",
    img:    source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
  },
  clean:    "./" + build_folder + "/"
};

// Browser Sync
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + build_folder + "/"
    },
    port: 3000,
    notify: false
  });
}

// HTML
function html() {
  return src(path.source.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// CSS
function css() {
  return src(path.source.scss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded"
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

// JS
function js() {
  return src(path.source.js)
    .pipe(sourcemaps.init())
    .pipe(fileinclude())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

// IMAGES
function images() {
  return src(path.source.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(gulp.dest(path.source.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

// FONTS
function fonts() {
  src(path.source.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.img))
  return src(path.source.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.img))
}

// MANUAL TASKS
gulp.task("otf2ttf", function() {
  return src([source_folder + "/fonts/*.otf"])
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(source_folder + "/fonts"));
});

gulp.task("svgSprite", function() {
  return gulp.src([source_folder + "/iconsprite/*.svg"])
  .pipe(
    svgSprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg", // sprite file name
          example: true
        }
      },
    })
  )
  .pipe(dest(path.build.img))
});

// WATCH FILES FOR CHANGES
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.scss], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

// CLEAN
function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.scss = scss;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
