const { src, dest, watch, parallel, series } = require("gulp");
const gulp = require("gulp");
const pug = require("gulp-pug");
const cssMinify = require("gulp-clean-css");
const cssConcat = require("gulp-concat-css");
const concatJs = require("gulp-concat");
const del = require("del");
const browserSync = require("browser-sync").create();
const uglifyJs = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const project_folder = "dist";
const source_folder = "src";

let path = {
  build: {
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    pug: source_folder + "/*.pug",
    css: source_folder + "/**/*.css",
    js: source_folder + "/**/*.js",
    img: source_folder + "/**/*.{png,gif,jpg,jpeg,svg,ico,webp}",
    fonts: source_folder + "/**/*.ttf",
    pug: source_folder + "/**/*.pug",
  },
  watch: {
    css: project_folder + "/**/*css",
    js: source_folder + "/**/*js",
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

// function js(params) {
//   return src(path.src.js)
//     .pipe(concatJs("all.js"))
//     .pipe(uglifyJs())
//     .pipe(dest(path.build.js))
//     .pipe(browserSync.stream());
// }

function img(params) {
  return src(path.src.img).pipe(imagemin()).pipe(dest("dist"));
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
  parallel(browsersync, watchFiles)
);
exports.css = css;
exports.img = img;
// exports.js = js;
exports.clean = clean;
exports.pugfunction = pugfunction;
exports.watch1 = watch1;
exports.default = watch1;
