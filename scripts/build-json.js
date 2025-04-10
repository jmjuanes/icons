import * as fs from "node:fs";
import * as path from "node:path";
import {extractIconPath} from "./helpers.js";
import pkg from "../package.json" with {type: "json"};
import meta from "../meta.json" with {type: "json"};

const build = () => {
    // read the 'icons' folder and extract the icon path
    const source = path.resolve("./icons");
    const icons = [];
    fs.readdirSync(source, "utf8").forEach(file => {
        if (path.extname(file, ".svg")) {
            const name = path.basename(file, ".svg");
            icons.push({
                name: name,
                path: extractIconPath(fs.readFileSync(path.join(source, file), "utf8")),
                version: meta[name]?.version || "",
                keywords: meta[name]?.keywords || [],
            });
        }
    });
    // write 'icons.json'
    const iconsPath = path.join(process.cwd(), "icons.json");
    const iconsData = {
        "$id": "./icons.schema.json",
        "version": pkg.version,
        "author": pkg.author,
        "repository": pkg.repository.url,
        "icons": icons,
    };
    // Save icons to JSON file
    return fs.writeFileSync(iconsPath, JSON.stringify(iconsData, null, "    "), "utf8");
};

// generate icons in json
build();
