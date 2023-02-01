const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const babel = require("gulp-babel");
const through = require("through2");
const CleanCSS = require("clean-css");
const Vinyl = require("vinyl");
const hbs = require("handlebars");

const pkg = require("./package.json");

// Register handlebars helpers
hbs.registerHelper({
    capitalizeFirst: str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    pascalCase: str => {
        return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
    },
    svg: str => {
        return new hbs.SafeString(encodeSvg(generateSvg(str)));
    },
});

// Tiny utility to extract the d="" segment from the icon
const getIconPath = str => str.match(/\sd="([^\"]*)"/im)[1];

// Generate icon SVG from path
const generateSvg = (p, size = "1em") => {
    const items = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">`,
		`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p}"/>`,
		`</svg>`
	];
    return items.join("");
};

// Encode SVG for using in CSS
// Based on https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
const encodeSvg = str => {
	return str
		.replace(/"/g, "'")
		.replace(/%/g, "%25")
		.replace(/#/g, "%23")
		.replace(/</g, "%3C")
		.replace(/>/g, "%3E");
};

const minify = options => {
    return through.obj((file, enc, callback) => {
        const content = file.contents.toString() || "";
        new CleanCSS(options).minify(content, (errors, result) => {
            if (errors) {
                return callback(errors.join(" "));
            }
            file.contents = new Buffer.from(result.styles);
            return callback(null, file);
        });
    });
};

const cleanIcons = () => {
    return through.obj(function (file, enc, callback) {
        const iconPath = getIconPath(file.contents.toString());
        const content = generateSvg(iconPath, "24");

        this.push(new Vinyl({
            path: path.join(process.cwd(), path.basename(file.path)),
            contents: new Buffer.from(content),
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

const compileHbs = sourceFile => {
    return through.obj(function (file, enc, callback) {
        const source = fs.readFileSync(sourceFile, "utf8");
        const template = hbs.compile(source);
        const iconsList = JSON.parse(file.contents.toString());
        const content = template({
            icons: iconsList,
            iconsCount: Object.keys(iconsList).length,
            version: pkg.version,
            repository: pkg.repository.url,
            bugs: pkg.bugs,
        });

        this.push(new Vinyl({
            path: path.join(process.cwd(), path.basename(sourceFile, ".hbs")),
            contents: new Buffer.from(content),
        }));
        return callback();
    });
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

gulp.task("build:css", () => {
    return gulp.src("icons/*.svg")
        .pipe(iconsToJson())
        .pipe(compileHbs(".build/mochicons.css.hbs"))
        .pipe(minify({
            compatibility: "*",
            level: 2,
        }))
        // .pipe(rename("mochicons.css"))
        .pipe(gulp.dest("packages/css"));
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
        .pipe(compileHbs(".build/index-react.js.hbs"))
        .pipe(rename("index.js"))
        .pipe(babel({
            configFile: false,
            plugins: [
                "@babel/plugin-transform-react-jsx",
            ],
        }))
        .pipe(gulp.dest("packages/react/"));
});

gulp.task("website", () => {
    return gulp.src("icons/*.svg")
        .pipe(iconsToJson())
        .pipe(compileHbs(".build/index.html.hbs"))
        // .pipe(rename("index.html"))
        .pipe(gulp.src("packages/css/mochicons.css"))
        .pipe(gulp.src("node_modules/lowcss/dist/low.css"))
        .pipe(gulp.dest("www"));
});
