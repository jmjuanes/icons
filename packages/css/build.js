const fs = require("node:fs");
const {generateSvg, encodeSvg, minifyCss} = require("../../scripts/helpers.js");
const {icons} = require("../../icons.json");

const build = () => {
    const separator = "\n";
    const css = [
        `:root,`,
        `*:before {`,
        ...icons.map(icon => {
            const path = encodeSvg(generateSvg(icon.path));
            return `--josemi-icons-${icon.name}: url("data:image/svg+xml;utf8,${path}") no-repeat;`;
        }),
        `}`,
        `[class^="ji-"],`,
        `[class*=" ji-"] {`,
        `    align-self: center;`,
        `    display: inline-flex;`,
        `    line-height: 1;`,
        `    text-rendering: auto;`,
        `    vertical-align: -0.125em;`,
        `}`,
        `[class^="ji-"]:before,`,
        `[class*=" ji-"]:before {`,
        `    content: "''";`,
        `    background-color: currentColor;`,
        `    display: inline-block;`,
        `    width: 1em;`,
        `    height: 1em;`,
        `}`,
        ...icons.map(icon => {
            const iconStyles = [
                `.ji-{{name}}:before {`
                `    mask: var(--josemi-icons-${icon.name}) no-repeat;`,
                `    mask-size: 100% 100%;`,
                `    -webkit-mask: var(--josemi-icons-${icon.name}) no-repeat;`,
                `    -webkit-mask-size: 100% 100%;`,
                `}`,
            ];
            return iconStyles.join(separator);
        }),
    ];
    // minify the css
    const output = minifyCss(css.join(separator), {
        level: 2,
        compatibility: "*",
    });
    // write the minified css to a file
    fs.writeFileSync("./icons.css", output.styles, "utf8");
};

// run build script
build();
