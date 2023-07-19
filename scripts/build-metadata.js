const fs = require("node:fs/promises");
const path = require("node:path");

const {version, author} = require("../package.json");

const main = () => {
    let metadata = null;
    const metadataPath = path.join(process.cwd(), "metadata.json");

    return fs.readFile(metadataPath, "utf8")
        .then(metadataStr => {
            metadata = JSON.parse(metadataStr);
            
            return fs.readdir(path.join(process.cwd(), "src"));
        })
        .then(files => files.filter(file => path.extname(file) === ".svg"))
        .then(files => {
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
                        keywords: [],
                    };
                }
            });

            return JSON.stringify(metadata, null, "    ");
        })
        .then(str => fs.writeFile(metadataPath, str, "utf8"))
        .then(() => {
            console.log("Metadata file updated");
        });

};


// Generate metadata file
main();
