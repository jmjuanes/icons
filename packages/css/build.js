const fs = require("node:fs");
const path = require("node:path");
const CleanCSS = require("clean-css");
const {generateSvg, encodeSvg} = require("../../scripts/helpers.js");

// const pkg = require("../../package.json");
const icons = require("../../icons.json");

const build = async () => {
    const mikel = (await import("mikel")).default;
    const template = fs.readFileSync("./icons.css.mustache", "utf8");
    const content = mikel(template, icons, {
        functions: {
            svg: args => {
                return encodeSvg(generateSvg(args.opt.path));
            },
        },
    });
    // minify the css
    const css = new CleanCSS({level: 2, compatibility: "*"}).minify(content);
    fs.writeFileSync("./icons.css", css, "utf8");
};

// run build script
build();
