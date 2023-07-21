const fs = require("node:fs/promises");
const path = require("node:path");

// Import metadata
const metadata = require("../metadata.json");

// Convert string to base64
// const toBase64 = str => {
//     return Buffer.from(str).toString("base64");
// };

const pascalCase = str => {
    return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
};

// Tiny utility to extract the d="" segment from the icon
const getIconPath = str => str.match(/\sd="([^\"]*)"/im)[1];

// Generate the icon content
const getIconContent = (p, separator = "") => {
    const iconContent = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">`,
        `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p}"/>`,
        `</svg>`,
    ];
    return iconContent.join(separator);
};

// Generate icon SVG from path
const generateSvg = async icons => {
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        const iconPath = path.join(process.cwd(), "icons", `${icon.name}.svg`);
        const iconContent = getIconContent(icon.path, "\n");
        await fs.writeFile(iconPath, iconContent, "utf-8");
    }
    return true;
};

const generateJson = icons => {
    const outputPath = path.join(process.cwd(), "icons.json");
    const outputJson = Object.fromEntries(icons.map(icon => {
        return [icon.name, icon];
    }));
    // Save icons to JSON file
    return fs.writeFile(outputPath, JSON.stringify(outputJson, null, "    "), "utf8");
};

const main = () => {
    const srcFolder = path.join(process.cwd(), "src");
    return fs.readdir(srcFolder)
        .then(icons => {
            return icons.filter(icon => path.extname(icon) === ".svg");
        })
        .then(icons => {
            return Promise.all(icons.map(icon => {
                const iconPath = path.join(srcFolder, icon);
                return fs.readFile(iconPath, "utf8").then(iconContent => {
                    const iconName = path.basename(icon, ".svg");
                    return {
                        name: iconName,
                        componentName: pascalCase(iconName),
                        version: metadata[iconName].version,
                        path: getIconPath(iconContent),
                        tags: metadata[iconName].tags || [],
                        contributors: metadata[iconName].contributors || [],
                    };
                });
            }));
        })
        .then(icons => {
            return Promise.all([
                generateSvg(icons),
                generateJson(icons),
            ]);
        });
};

// Build icons
main();
