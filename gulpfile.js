const { src, dest, watch, parallel, series } = require("gulp");
const gulp = require("gulp");
const pug = require("gulp-pug");
const cssMinify = require("gulp-clean-css");
const cssConcat = require("gulp-concat-css");
const del = require("del");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fonter = require("gulp-fonter");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const project_folder = "dist";
const source_folder = "src";

let path = {
  build: {
    css: project_folder + "/css/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    pug: source_folder + "/*.pug",
    css: source_folder + "/**/*.css",
    img: source_folder + "/**/*.{png,jpg}",
    pug: source_folder + "/**/*.pug",
    fonts: source_folder + "/**/*.ttf",
  },
  watch: {
    css: project_folder + "/**/*css",
    img: source_folder + "/**/*img",
    pug: source_folder + "/**/*pug",
  },
  pathBs: "./" + project_folder + "/",
};

function browsersync(params) {
  browserSync.init({
    server: {
      baseDir: path.pathBs,
    },
    port: 3000,
    notify: false,
  });
}

function pugfunction(params) {
  return src(path.src.pug)
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist"));
  // browserSync.stream();
}

function css(params) {
  return src(path.src.css)
    .pipe(cssConcat("main.css"))
    .pipe(cssMinify())
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function img(params) {
  return src(path.src.img).pipe(imagemin()).pipe(dest("dist"));
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}
//fonts otf
function fontsotf() {
  return src(path.src + "**/*.otf")
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(path.src.fonts));
}

function watchFiles(params) {
  watch(["src/**/*.pug"], pugfunction);
  watch(["src/**/*.css"], css);
  watch([path.src.img], img);
}

function clean() {
  return del("dist");
}

const watch1 = series(
  clean,
  css,
  img,
  pugfunction,
  fontsotf,
  fonts,
  parallel(browsersync, watchFiles)
);
exports.css = css;
exports.img = img;
// exports.js = js;
exports.clean = clean;
exports.pugfunction = pugfunction;
exports.fonts = fonts;
exports.fontsotf = fontsotf;
exports.watch1 = watch1;
exports.default = watch1;
