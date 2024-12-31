const fs = require("node:fs");
const path = require("node:path");
const {generateSvg} = require("./helpers.js");
const {version} = require("../package.json");

// Tiny utility to extract the d="" segment from the icon
const getIconPath = str => str.match(/\sd="([^\"]*)"/im)[1];

// Generate icon SVG from path
const generateIconsImages = icons => {
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        const iconPath = path.join(process.cwd(), "icons", `${icon.name}.svg`);
        const iconContent = generateSvg(icon.path, "1em", "\n");
        fs.writeFileSync(iconPath, iconContent, "utf-8");
    }
};

const generateIconsJson = icons => {
    const iconsPath = path.join(process.cwd(), "icons.json");
    const iconsJson = {
        "$id": "./icons.schema.json",
        "version": version,
        "icons": icons,
    };
    // Save icons to JSON file
    return fs.writeFileSync(iconsPath, JSON.stringify(iconsJson, null, "    "), "utf8");
};

const build = () => {
    const srcFolder = path.join(process.cwd(), "src");
    const iconsFiles = fs.readdirSync(srcFolder);
    const icons = [];
    // Generate icons in JSON format
    for (let i = 0; i < iconsFiles.length; i++) {
        const icon = iconsFiles[i];
        if (path.extname(icon) === ".svg") {
            const name = path.basename(icon, ".svg");
            const iconPath = path.join(srcFolder, icon);
            const iconContent = fs.readFileSync(iconPath, "utf8");
            // Insert icon object
            icons.push({
                name: name,
                path: getIconPath(iconContent),
            });
        }
    }
    // Generate SVG and JSON
    generateIconsImages(icons);
    generateIconsJson(icons);
};

// Build icons
build();
