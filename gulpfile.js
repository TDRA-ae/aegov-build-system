const { src, dest, watch, series } = require("gulp");
const include = require("gulp-file-include");
const postcss = require("gulp-postcss");
const tailwindPostcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const replace = require("gulp-replace");
const prettify = require("gulp-html-prettify");

/* ===============================
   HTML TASKS
================================ */

function htmlDev() {
  return src("src/pages/**/*.html")
    .pipe(
      include({
        prefix: "@@",
        basepath: "src/includes",
        context: { "additional-class": "", variant: "" },
      })
    )
    .pipe(replace(/\s+class="([^"]+)\s+"/g, ' class="$1"'))
    .pipe(
      prettify({
        indent_char: " ",
        indent_size: 2,
        wrap_line_length: 80,
        preserve_newlines: true,
      })
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function htmlBuild() {
  return src("src/pages/**/*.html")
    .pipe(
      include({
        prefix: "@@",
        basepath: "src/includes",
        context: { "additional-class": "", variant: "" },
      })
    )
    .pipe(replace(/\s+class="([^"]+)\s+"/g, ' class="$1"'))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(dest("build"));
}

/* ===============================
   CSS TASKS (TAILWIND v4)
================================ */

function cssDev() {
  return src("src/styles/style.css")
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        tailwindPostcss(), // ✅ Tailwind v4 PostCSS plugin
        autoprefixer,
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function cssBuild() {
  return src("src/styles/style.css")
    .pipe(
      postcss([
        tailwindPostcss(),
        autoprefixer,
      ])
    )
    .pipe(cleanCSS())
    .pipe(dest("build/css"));
}

/* ===============================
   JS TASKS
================================ */

function jsDev() {
  return src("src/js/**/*.js")
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function jsBuild() {
  return src("src/js/**/*.js").pipe(dest("build/js"));
}

/* ===============================
   IMAGE TASKS
================================ */

function imagesDev() {
  return src("src/images/**/*")
    .pipe(dest("dist/images"))
    .pipe(browserSync.stream());
}

function imagesBuild() {
  return src("src/images/**/*").pipe(dest("build/images"));
}

/* ===============================
   DEV SERVER
================================ */

function serve() {
  browserSync.init({
    server: { baseDir: "dist" },
    notify: false,
  });

  watch("src/pages/**/*.html", htmlDev);
  watch(["src/styles/**/*.css", "src/**/*.html"], cssDev); // ✅ removed tailwind.config.js
  watch("src/js/**/*.js", jsDev);
  watch("src/images/**/*", imagesDev);
}

/* ===============================
   EXPORTS
================================ */

exports.html = htmlDev;
exports.css = cssDev;
exports.js = jsDev;
exports.images = imagesDev;

exports.dev = series(htmlDev, cssDev, jsDev, imagesDev);
exports["dev:watch"] = series(htmlDev, cssDev, jsDev, imagesDev, serve);
exports.build = series(htmlBuild, cssBuild, jsBuild, imagesBuild);
exports.default = exports.dev;
