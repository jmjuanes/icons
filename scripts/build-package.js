const webpack = require("webpack");
const babel = require("@babel/core");
const path = require("node:path");

const {icons} = require("../icons.json");

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

// Transform for packages
const transforms = {
    react: {
        output: {
            "esm": {
                type: "module",
            },
            "cjs": {
                type: "commonjs2",
            },
        },
        externals: {
            react: "react",
        },
        generateEntry: () => {
            const code = [
                `import React from "react";`,
                `export const Icon = props => (`,
                `    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24">`,
                `        <g fill="none" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke}>`,
                `            <path d={props.path || ""} />`,
                `        </g>`,
                `    </svg>`,
                `);`,
                `Icon.defaultProps = {`,
                `    path: "",`,
                `    size: "1em",`,
                `    color: "currentColor",`,
                `    stroke: 2,`,
                `};`,
                ...icons.map(icon => {
                    return `export const ${icon.componentName}Icon = props => (<Icon {...props} path={"${icon.path}"} />);`;
                }),
                `const ICONS = {`,
                ...icons.map(icon => {
                    return `"${icon.name}": ${icon.componentName}Icon,`;
                }),
                `};`,
                `export const renderIcon = name => React.createElement(ICONS[name], {});`,
            ];
            return babel.transformSync(code.join("\n"), {
                presets: [
                    "@babel/preset-react",
                ],
            });
        },
    },
};

// Generate webpack configuration
const build = async pkg => {
    if (!pkg || !transforms[pkg]) {
        throw new Error("Please specify a package to build");
    }
    const transform = transforms[pkg];
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
