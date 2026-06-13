import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join, basename, extname } from "node:path";
import { extractIconPath } from "./common.js";
import pkg from "../package.json" with { type: "json" };
import type { Icon } from "./common.ts";

// convert string to pascal case
const pascalCase = (str: string = ""): string => {
    return str.match(/[a-zA-Z0-9]+/g)?.map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("") || "";
};

const build = () => {
    // read the 'icons' folder and extract the icon path
    const source = resolve("./icons");
    const icons: Icon[] = [];
    readdirSync(source, "utf8").forEach((file: string) => {
        if (extname(file) === ".svg") {
            const name = basename(file, ".svg");
            icons.push({
                name: name,
                componentName: pascalCase(name),
                path: extractIconPath(readFileSync(join(source, file), "utf8")),
            } as Icon);
        }
    });
    // write 'icons.json'
    const iconsPath = join(process?.cwd(), "icons.json");
    const iconsData = {
        "$id": "https://josemi.xyz/icons/icons.schema.json",
        "version": pkg.version,
        "author": pkg.author,
        "repository": pkg.repository.url,
        "icons": icons,
    };
    // Save icons to JSON file
    return writeFileSync(iconsPath, JSON.stringify(iconsData, null, "    "), "utf8");
};

// generate icons in json
build();
