import * as fs from "node:fs";
import iconsConfig from "../../icons.json" with {type: "json"};

const getIconSymbol = icon => {
    return [
        `<symbol id="${icon.name}" viewBox="0 0 24 24">`,
        `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon.path}"/>`,
        `</symbol>`,
    ];
};

const build = () => {
    const separator = "\n";
    const sprite = [
        `<svg xmlns="http://www.w3.org/2000/svg">`,
        ...(iconsConfig.icons.map(icon => getIconSymbol(icon)).flat()),
        `</svg>`,
    ];
    // write sprite to file
    fs.writeFileSync("./sprite.svg", sprite.join(separator), "utf8");
};

build();
