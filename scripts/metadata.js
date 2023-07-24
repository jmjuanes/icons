const fs = require("node:fs/promises");
const path = require("node:path");
const {version} = require("../package.json");

const generateTags = iconName => {
    return iconName.split("-").filter(value => !!value);
};

// Get names from files
const getNamesFromFiles = (list, extname) => {
    return list
        .filter(file => path.extname(file) === extname)
        .map(file => path.basename(file, extname));
};

const main = async () => {
    const metadataFolder = path.join(process.cwd(), "metadata");
    const iconsFolder = path.join(process.cwd(), "src");
    const result = await Promise.all([
        fs.readdir(metadataFolder),
        fs.readdir(iconsFolder),
    ]);
    const metadataNames = getNamesFromFiles(result[0], ".json");
    const iconsWithMetadata = new Set(metadataNames);
    // Filter icons whth no metadata
    const icons = getNamesFromFiles(result[1], ".svg").filter(icon => {
        return !iconsWithMetadata.has(icon);
    });
    // Generate a metadata file for each icon
    for (let i = 0; i < icons.length; i++) {
        const name = icons[i];
        const metadata = {
            "$schema": "../metadata.schema.json",
            "name": name,
            "version": version,
            "contributors": [
                "jmjuanes",
            ],
            "categories": [],
            "tags": generateTags(name),
        };
        const metadataPath = path.join(metadataFolder, `${name}.json`);
        const metadataContent = JSON.stringify(metadata, null, "    ");
        await fs.writeFile(metadataPath, metadataContent, "utf8");
    }
    // Convert metadata object to string
    // return JSON.stringify(metadata, null, "    ");
    // await fs.writeFile(metadataPath, str, "utf8");
    console.log("Metadata updated");
};

// Generate metadata file
main();
