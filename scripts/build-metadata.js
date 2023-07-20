const fs = require("node:fs/promises");
const path = require("node:path");

const {version, author} = require("../package.json");

const generateKeywords = iconName => {
    return iconName.split("-");
};

const main = () => {
    const metadataPath = path.join(process.cwd(), "metadata.json");
    const iconsPath = path.join(process.cwd(), "src");
    const promises = [
        fs.readFile(metadataPath, "utf8"),
        fs.readdir(iconsPath),
    ];

    return Promise.all(promises)
        .then(result => {
            const metadata = JSON.parse(result[0]);
            const files = result[1].filter(f => path.extname(f) === ".svg");
            // Add new files to the metadata object
            files.forEach(file => {
                const iconName = path.basename(file, ".svg");
                if (typeof metadata[iconName] === "undefined") {
                    metadata[iconName] = {
                        created: version,
                        lastUpdated: null,
                        contributors: [
                            author,
                        ],
                        category: "",
                        keywords: generateKeywords(iconName),
                    };
                }
            });
            // Fix keywords of existing icons
            // Object.keys(metadata).forEach(iconName => {
            //     if (metadata[iconName].keywords.length === 0) {
            //         metadata[iconName].keywords = generateKeywords(iconName);
            //     }
            // });
            // Convert metadata object to string
            return JSON.stringify(metadata, null, "    ");
        })
        .then(str => fs.writeFile(metadataPath, str, "utf8"))
        .then(() => {
            console.log("Metadata file updated");
        });
};


// Generate metadata file
main();
