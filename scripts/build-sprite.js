const fs = require("node:fs/promises");
const path = require("node:path");
const {icons} = require("../icons.json");

const getIconSymbol = icon => {
    return [
        `<symbol id="${icon.name}" viewBox="0 0 24 24">`,
        `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon.path}"/>`,
        `</symbol>`,
    ];
};

const getSpriteContent = () => {
    const spriteContent = [
        `<svg xmlns="http://www.w3.org/2000/svg">`,
        ...(icons.map(icon => getIconSymbol(icon)).flat()),
        `</svg>`,
    ];
    return spriteContent.join("\n");
};

const buildSprite = output => {
    const svgCode = getSpriteContent();
    // Check if output path has been provided
    if (output) {
        const svgPath = path.join(process.cwd(), output);
        return fs.writeFile(svgPath, svgCode, "utf8").then(() => {
            console.log(`[build:sprite] Sprite image saved to '${svgPath}'`);
        });
    }
    // If not, print in console
    console.log(svgCode);
};

buildSprite(process.argv.slice(2)[0]);
