const rollup = require("rollup");
const babel = require("@rollup/plugin-babel");
const virtual = require("@rollup/plugin-virtual");
const path = require("node:path");

const icons = require("../icons.json");

const pascalCase = str => {
    return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
};

// Transform for packages
const transforms = {
    react: {
        externals: ["react"],
        babelConfig: {
            presets: [
                "@babel/preset-react",
            ],
        },
        generateEntry: () => {
            const code = [
                `import React from "react";`,
                `export const Icon = props => (`,
                `    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">`,
                `        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">`,
                `            <path d={props.path} />`,
                `        </g>`,
                `    </svg>`,
                `);`,
            ];
            Object.values(icons).forEach(icon => {
                code.push(`export const ${pascalCase(icon.name)}Icon = () => (<Icon path="${icon.path}" />);`);
            });

            return code.join("\n");
        },
    },
};

const build = () => {
    const outputFormats = ["esm", "cjs"];
    const rollupPromises = Object.keys(transforms).map(pkg => {
        const transform = transforms[pkg];
        const inputOptions = {
            external: transform.externals,
            input: "entry",
            plugins: [
                virtual({
                    entry: transform.generateEntry(),
                }),
                babel(transform.babelConfig),
            ],
        };
        return rollup.rollup(inputOptions)
            .then(bundle => {
                const outputOptions = outputFormats.map(format => {
                    return {
                        file: `index.${format}.js`,
                        dir: path.join(process.cwd(), "packages", pkg),
                        format: format,
                    };
                });
                return bundle.write(outputOptions);
            });
    });
    return Promise.all(rollupPromises).then(() => {
        console.log("Build finished");
    });
};

build();
