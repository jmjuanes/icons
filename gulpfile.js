const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const through = require("through2");
const Vinyl = require("vinyl");

const processIcons = () => {
        
};

const iconsToJson = () => {
    let lastFile = null;
    const icons = {};
    const bufferContents = function (file, enc, callback) {
        const content = file.contents.toString();
        const name = path.basename(file.path, ".svg");
        icons[name] = {
            name: name,
            path: /\sd="([\w,\.\-\s]*)"/gm.exec(content)[1] || "",
        };
        lastFile = file; // Save reference to last file
        return callback();
    };
    const endStream = function (callback) {
        /// const output = JSON.stringify(icons, null, "    ");
        this.push(new Vinyl({
            base: lastFile.base,
            path: path.join(lastFile.base, "icons.json"),
            contents: new Buffer.from(JSON.stringify(icons, null, "    ")),
        }));
        return callback();
    };
    return through.obj(bufferContents, endStream);
};

gulp.task("clean", () => null);

gulp.task("build:json", () => {
    return gulp.src("icons/*.svg")
        .pipe(iconsToJson())
        .pipe(gulp.dest("packages/json/"));
});

gulp.task("build:react", () => {
    // return gulp.src("icons/*.svg")
    //     .pipe(iconsToJson())
    //     .pipe(gulp.dest("packages/json/"));
});

