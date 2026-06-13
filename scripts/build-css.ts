import { readFileSync, writeFileSync } from "node:fs";
import { generateSvg, encodeSvg, minifyCss } from "./helpers.ts";
import type { Icon } from "./common.ts";

const build = () => {
    const separator = "\n";
    const iconsConfig = JSON.parse(readFileSync("icons.json", "utf8"));
    const icons = iconsConfig.icons as Icon[];
    const css = [
        `:root,`,
        `*:before {`,
        ...icons.map((icon: Icon) => {
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
        ...icons.map((icon: Icon) => {
            const iconStyles = [
                `.ji-${icon.name}:before {`,
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
    writeFileSync("icons.css", output.styles, "utf8");
};

// run build script
build();
