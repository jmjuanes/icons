const webpack = require("webpack");
const path = require("node:path");

const virtualEntry = code => {
	const base64 = Buffer.from(code).toString("base64");
	return `data:text/javascript;base64,${base64}`;
};

// Compile a webpack configuration
const compileWebpack = configuration => {
    return new Promise((resolve, reject) => {
        return webpack(configuration, (error, stats) => {
            if (error || stats.hasErrors()) {
                console.error(error);
                return reject(error);
            }
            // process.stdout.write(stats.toString() + "\n");
            return resolve();
        });
    });
};

// Generate webpack configuration
const build = async pkg => {
    const transform = require(`../packages/${pkg}/build.js`);
    const outputs = Object.keys(transform.output);
    const entry = transform.generateEntry();
    for (let i = 0; i < outputs.length; i++) {
        const name = outputs[i];
        console.log(`[build] Generating output with type='${name}'...`);
        await compileWebpack({
            mode: "production",
            target: ["web", "es2020"],
            entry: virtualEntry(entry.code),
            output: {
                path: path.join(process.cwd(), "packages", pkg),
                filename: `index.${name}.js`,
                clean: false,
                library: transform.output[name],
            },
            externals: transform.externals || {},
            experiments: {
                outputModule: transform.output[name].type === "module",
            },
            optimization: {
                minimize: true,
            },
            plugins: [
                new webpack.ProgressPlugin(),
            ],
        });
    }
};

build(process.argv.slice(2)[0]);
