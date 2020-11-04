const { src, dest } = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");

const del = require("del");
const rename = require("gulp-rename");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const clean_css = require("gulp-clean-css"); //minifier
const sourcemaps = require("gulp-sourcemaps");


const uglify = require("gulp-uglify-es");
const babel = require("gulp-babel");

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const webpcss = require("gulp-webp-css");
const svgSrite = require("gulp-svg-sprite");

const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 require("gulp-ttf2woff2");
const fonter = require("gulp=fonter");

let source_folder = "source";
let build_folder = "build";

let path = {
  source: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    scss: source_folder + "/scss/",
    js: source_folder + "/js/",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf"
  },
  build: {
    html: build_folder + "/",
    css: build_folder + "/css/",
    js: build_folder + "/js/",
    img: build_folder + "/img/",
    fonts: build_folder + "/fonts/"
  },
  watch: {
    html: source_folder + "/**/*.html",
    scss: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
  },
  clean: "./" + build_folder + "/"
};

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + build_folder + "/"
    },
    port: 3000,
    notify: false
  });
}

function html() {
  return src(path.source.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

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
      .pipe(webpcss())
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
        rename({
          extname: ".min.css"
        })
      )
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

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
        optimizaionLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts() {
  src(path.source.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.img))
  return src(path.source.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.img))
}

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

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.scss], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

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
