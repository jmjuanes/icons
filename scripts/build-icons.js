const fs = require("node:fs/promises");
const path = require("node:path");
const {version} = require("../package.json");

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
    const iconsPath = path.join(process.cwd(), "icons.json");
    const iconsJson = {
        "$id": "./icons.schema.json",
        "version": version,
        "icons": icons,
    };
    // Save icons to JSON file
    return fs.writeFile(iconsPath, JSON.stringify(iconsJson, null, "    "), "utf8");
};

const main = async () => {
    const srcFolder = path.join(process.cwd(), "src");
    const metadataFolder = path.join(process.cwd(), "metadata");
    const iconsFiles = await fs.readdir(srcFolder);
    const icons = [];
    // Generate icons in JSON format
    for (let i = 0; i < iconsFiles.length; i++) {
        const icon = iconsFiles[i];
        if (path.extname(icon) === ".svg") {
            const name = path.basename(icon, ".svg");
            const iconPath = path.join(srcFolder, icon);
            const iconContent = await fs.readFile(iconPath, "utf8");
            const metadataPath = path.join(metadataFolder, `${name}.json`);
            const metadataContent = await fs.readFile(metadataPath, "utf8");
            const metadata = JSON.parse(metadataContent);
            // Insert icon object
            icons.push({
                name: name,
                componentName: pascalCase(name),
                version: metadata.version,
                path: getIconPath(iconContent),
                contributors: metadata.contributors || [],
                tags: metadata.tags || [],
            });
        }
    }
    // Generate SVG and JSON
    await generateSvg(icons);
    await generateJson(icons);
};

// Build icons
main();
