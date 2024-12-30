const fs = require("node:fs");
const {generateSvg, encodeSvg, minifyCss} = require("../../scripts/helpers.js");
const icons = require("../../icons.json");

const build = async () => {
    const mikel = (await import("mikel")).default;
    const template = fs.readFileSync("../../templates/icons.css.mustache", "utf8");
    const content = mikel(template, icons, {
        functions: {
            svg: args => {
                return encodeSvg(generateSvg(args.opt.path));
            },
        },
    });
    // minify the css
    const output = minifyCss(content, {
        level: 2,
        compatibility: "*",
    });
    // write the minified css to a file
    fs.writeFileSync("./icons.css", output.styles, "utf8");
};

// run build script
build();
