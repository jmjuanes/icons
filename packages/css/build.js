import * as fs from "node:fs";
import {generateSvg, encodeSvg, minifyCss} from "../../scripts/helpers.js";
import iconsConfig from "../../icons.json" with {type: "json"};

const build = () => {
    const separator = "\n";
    const icons = iconsConfig.icons;
    const css = [
        `:root,`,
        `*:before {`,
        ...icons.map(icon => {
            const data = encodeSvg(generateSvg(icon.path));
            return `--josemi-icons-${icon.name}: url("data:image/svg+xml;utf8,${data}") no-repeat;`;
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
                `.ji-{{name}}:before {`,
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
