import * as fs from "node:fs";
import * as path from "node:path";
import pkg from "../package.json" with {type: "json"};

// read a json file
const readJson = file => {
    return JSON.parse(fs.readFileSync(file, "utf8"));
};

// write the json file
const writeJson = (file, content) => {
    return fs.writeFileSync(file, JSON.stringify(content, null, "    "), "utf8");
};

// prepare next release
const main = () => {
    console.log("[release] Prepare release for packages in './packages' folder");
    const packagesFolder = path.join(process.cwd(), "packages");
    const packagesList = fs.readdirSync(packagesFolder);
    console.log(`[release] Found ${packagesList.length} packages to prepare`);
    // Prepare each package in ./packages folder
    packagesList.forEach(name => {
        console.log(`[release] Preparing package '${name}'...`);
        const packagePath = path.join(packagesFolder, name, "package.json");
        const currentPkg = readJson(packagePath);
        currentPkg.version = pkg.version;
        writeJson(packagePath, currentPkg);
    });
    // Finish release prepare script
    console.log("[release] Release ready");
};

main();
