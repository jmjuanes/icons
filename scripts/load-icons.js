import * as fs from "node:fs";
import * as path from "node:path";
import {parseArgs} from "node:util";
import {extractIconPath, generateSvg} from "./helpers.js";

// this script loads the content of the 'src' folder and updates the 'icons' folder
// with the new icons
const loadIcons = (options) => {
    if (!options.values.version && !options.values.skipVersion) {
        console.error(`[load] ERROR: version is required. Use --version to set the version, or --skipVersion to skip it.`);
        process.exit(1);
    }
    const source = path.resolve(options.values.source || "src");
    const destination = path.resolve("icons");
    console.log(`[load] Loading icons from "${source}"...`);
    if (!fs.existsSync(source)) {
        console.error(`[load] ERROR: source folder "${source}" does not exist. Aborting...`);
        process.exit(1);
    }
    // get the list of icons in the source folder
    const icons = fs.readdirSync(source, "utf8")
        .filter(file => path.extname(file) === ".svg")
        .map(file => {
            // check if the icon already exists in the destination folder
            const existsInDestination = fs.existsSync(path.join(destination, file));
            if (existsInDestination && !options.values.overwrite) {
                console.error(`[load] ERROR: icon "${file}" already exists in "${destination}". Use --overwrite to overwrite it.`);
                process.exit(1);
            }
            // parse icon metadata
            return {
                name: path.basename(file, ".svg"),
                path: extractIconPath(fs.readFileSync(path.join(source, file), "utf-8")),
                alreadyExists: existsInDestination,
            };
        });
    console.log(`[load] Found ${icons.length} icons in "${source}".`);
    const existingIcons = icons.filter(icon => icon.alreadyExists);
    if (existingIcons.length > 0) {
        console.warn(`[load] WARNING: ${existingIcons.length} icons already exist in "${destination}": '${existingIcons.map(icon => icon.name).join(", ")}'.`);
    }
    // saving icons
    icons.forEach(icon => {
        fs.writeFileSync(path.join(destination, icon.name + ".svg"), generateSvg(icon.path, "1em", "\n"), "utf-8");
    });
    // print stats
    console.log(`[load] Loaded ${icons.length} icons.`);
    // update the meta object with the new icons
    if (icons.length > 0) {
        const meta = JSON.parse(fs.readFileSync(path.join("meta.json"), "utf-8"));
        icons.forEach(icon => {
            if (!meta[icon.name]) {
                meta[icon.name] = {}; // initialize icon object
            }
            meta[icon.name].version = options.values.version || meta[icon.name].version || "";
            meta[icon.name].keywords = meta[icon.name].keywords || [];
        });
        // save the meta object
        const sortedMeta = Object.fromEntries(Object.keys(meta).sort().map(key => {
            return [key, meta[key]];
        }));
        fs.writeFileSync(path.join("meta.json"), JSON.stringify(sortedMeta, null, "    "), "utf-8");
        console.log(`[load] Updated meta.json with ${icons.length} new icons.`);
    }
    console.log(`[load] Load finished.`);
};

// run load-icons script
loadIcons(parseArgs({
    args: process.argv.slice(2),
    options: {
        source: {
            type: "string",
            default: "src",
        },
        overwrite: {
            type: "boolean",
            default: false,
            description: "Overwrite existing icons",
        },
        version: {
            type: "string",
            description: "Version of the icons to generate the release",
        },
        skipVersion: {
            type: "boolean",
            default: false,
            description: "Skip setting the version in meta.json",
        },
    },
}));
