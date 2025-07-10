const { src, dest, watch, series, parallel } = require("gulp");
const include = require("gulp-file-include"); // For HTML file includes
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css"); // Minifies CSS
const sourcemaps = require("gulp-sourcemaps"); // Generates source maps
const browserSync = require("browser-sync").create();
const replace = require("gulp-replace"); // Add this at the top
const prettify = require("gulp-html-prettify"); // For HTML formatting
// ✅ Process HTML (Development → dist/)
function htmlDev() {
  return src("src/pages/**/*.html")
    .pipe(include({ prefix: "@@", basepath: "src/includes",  context: { "additional-class": "", "variant": "" } }))
     .pipe(replace(/\s+class="([^"]+)\s+"/g, ' class="$1"')) // Remove extra spaces
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2,
      wrap_line_length: 80,
      preserve_newlines: true
    }))
    .on("error", console.log)
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// ✅ Process HTML (Production → build/)
function htmlBuild() {
  return src("src/pages/**/*.html")
    .pipe(include({ prefix: "@@", basepath: "src/includes",  context: { "additional-class": "", "variant": "" } }))
     .pipe(replace(/\s+class="([^"]+)\s+"/g, ' class="$1"')) // Remove extra spaces
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2,
      wrap_line_length: 80,
      preserve_newlines: true
    }))
    .on("error", console.log)
    .pipe(dest("build"));
}

// ✅ Process Tailwind CSS (Development → dist/, No Minification)
function cssDev() {
  return src("src/styles/style.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require("tailwindcss")("./tailwind.config.js"),
      autoprefixer
    ]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// ✅ Process Tailwind CSS (Production → build/, Minified)
function cssBuild() {
  return src("src/styles/style.css")
    .pipe(postcss([
      require("tailwindcss")("./tailwind.config.js"),
      autoprefixer
    ]))
    .pipe(cleanCSS()) // Minify CSS
    .pipe(dest("build/css"));
}

// ✅ Process JavaScript (Development → dist/)
function jsDev() {
  return src("src/js/**/*.js")
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

// ✅ Process JavaScript (Production → build/)
function jsBuild() {
  return src("src/js/**/*.js")
    .pipe(dest("build/js"));
}

// ✅ Process images (Development → dist/)
function imagesDev() {
  return src("src/images/**/*")
    .pipe(dest("dist/images"))
    .pipe(browserSync.stream());
}

// ✅ Process JavaScript (Production → build/)
function imagesBuild() {
  return src("src/images/**/*")
    .pipe(dest("build/images"));
} 

// ✅ Serve & Watch Files for Changes (Development)
function serve() {
  browserSync.init({
    server: { baseDir: "dist" },
    notify: false,
  });

  watch("src/pages/**/*.html", htmlDev);
  watch(["src/styles/*.css", "src/**/*.html", "tailwind.config.js"], cssDev);
  watch("src/js/**/*.js", jsDev);
  watch("src/images/**/*", imagesDev);
}

// ✅ Gulp Commands
exports.html = htmlDev;
exports.css = cssDev;
exports.js = jsDev;
exports.images = imagesDev;
exports.dev = series(htmlDev, cssDev, jsDev, imagesDev);
exports["dev:watch"] = series(htmlDev, cssDev, jsDev, imagesDev, serve);
exports.build = series(htmlBuild, cssBuild, jsBuild, imagesBuild);
exports.default = exports.dev;
