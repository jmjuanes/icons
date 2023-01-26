const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const babel = require("gulp-babel");
const through = require("through2");
const Vinyl = require("vinyl");
const hbs = require("handlebars");

const pkg = require("./package.json");

// Register handlebars helpers
hbs.registerHelper("capitalizeFirst", str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
hbs.registerHelper("pascalCase", str => {
    return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
});

// Tiny utility to extract the d="" segment from the icon
const getIconPath = str => str.match(/\sd="([^\"]*)"/im)[1];

const cleanIcons = () => {
    return through.obj(function (file, enc, callback) {
        const iconPath = getIconPath(file.contents.toString());
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
    let unicode = 57344;
    let metadata = {};
    if (fs.existsSync("metadata.json")) {
        metadata = JSON.parse(fs.readFileSync("metadata.json", "utf8"));
        unicode = Math.max.apply(Object.keys(metadata).map(item => item.unicode)) + 1;
    }
    const bufferContents = function (file, enc, callback) {
        const name = path.basename(file.path, ".svg");
        if (!metadata[name]) {
            metadata[name] = {
                name: name,
                keywords: [],
                unicode: unicode,
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
            path: getIconPath(content),
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

gulp.task("build:sprite", () => {
    return gulp.src("icons/*.svg")
        .pipe(svgstore())
        .pipe(rename("mochicons.svg"))
        .pipe(gulp.dest("."));
});

gulp.task("build:node", () => {
    return gulp.src("icons/*.svg")
        .pipe(iconsToJson())
        .pipe(rename("icons.json"))
        .pipe(gulp.dest("packages/node/"));
});

gulp.task("build:react", () => {
    return gulp.src("icons/*.svg")
        .pipe(iconsToJson())
        .pipe(through.obj(function (file, enc, callback) {
            const source = fs.readFileSync(".build/index-react.hbs", "utf8");
            const template = hbs.compile(source);
            const content = template({
                icons: JSON.parse(file.contents.toString()),
                version: pkg.version,
            });

            this.push(new Vinyl({
                path: path.join(process.cwd(), "index.js"),
                contents: new Buffer.from(content),
            }));
            return callback();
        }))
        .pipe(babel({
            configFile: false,
            plugins: [
                "@babel/plugin-transform-react-jsx",
            ],
        }))
        .pipe(gulp.dest("packages/react/"));
});

