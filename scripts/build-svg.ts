import { readFileSync, writeFileSync } from "node:fs";
import type { Icon } from "./common.ts";

const getIconSymbol = (icon: Icon): string[] => {
    return [
        `<symbol id="${icon.name}" viewBox="0 0 24 24">`,
        `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon.path}"/>`,
        `</symbol>`,
    ];
};

const build = () => {
    const iconsConfig = JSON.parse(readFileSync("icons.json", "utf8"));
    const separator = "\n";
    const sprite = [
        `<svg xmlns="http://www.w3.org/2000/svg">`,
        ...(iconsConfig.icons.map((icon: Icon) => getIconSymbol(icon)).flat()),
        `</svg>`,
    ];
    // write sprite to file
    writeFileSync("./icons.svg", sprite.join(separator), "utf8");
};

build();
