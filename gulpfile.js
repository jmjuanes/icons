const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const through = require("through2");
const Vinyl = require("vinyl");

const cleanIcons = () => {
    return through.obj(function (file, enc, callback) {
        const iconPath = file.contents.toString().match(/\sd="([^\"]*)"/im)[1];
        const content = [
            `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">`,
            `<g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">`,
            `<path d="${iconPath}" />`,
            `</g>`,
            `</svg>`,
        ];
        this.push(new Vinyl({
            path: path.join(process.cwd(), path.basename(file.path)),
            contents: new Buffer.from(content.join("")),
        }));
        return callback();
    });
};

const generateMetadata = () => {
    let unicode = 57343;
    let metadata = {};
    if (fs.existsSync("metadata.json")) {
        metadata = JSON.parse(fs.readFileSync("metadata.json", "utf8"));
        unicode = Math.max.apply(Object.keys(metadata).map(item => item.unicode));
    }
    const bufferContents = function (file, enc, callback) {
        const name = path.basename(file.path, ".svg");
        if (!metadata[name]) {
            metadata[name] = {
                name: name,
                keywords: [],
                unicode: unicode + 1,
            };
            unicode = unicode + 1;
        }
        return callback();
    };
    const endStream = function (callback) {
        this.push(new Vinyl({
            path: path.join(process.cwd(), "metadata.json"),
            contents: new Buffer.from(JSON.stringify(metadata, null, "    ")),
        }));
        return callback();
    };
    return through.obj(bufferContents, endStream);
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

gulp.task("update:icons-svg", () => {
    return gulp.src("raw-icons/**/*.svg")
        .pipe(cleanIcons())
        .pipe(gulp.dest("icons"));
});

gulp.task("update:icons-metadata", () => {
    return gulp.src("icons/*.svg")
        .pipe(generateMetadata())
        .pipe(gulp.dest("."));
});

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

