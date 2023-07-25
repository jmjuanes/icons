const fs = require("node:fs/promises");
const path = require("path");

const {version} = require("../package.json");

const readJson = file => {
    return fs.readFile(file, "utf8")
        .then(data => JSON.parse(data));
};

const writeJson = (file, content) => {
    return fs.writeFile(file, JSON.stringify(content, null, "    "), "utf8");
};

// Prepare next release
const main = async () => {
    console.log("[release] Prepare release for packages in './packages' folder");
    const packagesFolder = path.join(process.cwd(), "packages");
    const packagesList = await fs.readdir(packagesFolder);
    console.log(`[release] Found ${packagesList.length} packages to prepare`);
    // Prepare each package in ./packages folder
    for (let i = 0; i < packagesList.length; i++) {
        const name = packagesList[i];
        console.log(`[release] Preparing package '${name}'...`);
        const packagePath = path.join(packagesFolder, name, "package.json");
        const currentPkg = await readJson(packagePath);
        currentPkg.version = version;
        await writeJson(packagePath, currentPkg);
    }
    // Finish release prepare script
    console.log("[release] Release ready");
};

main();
