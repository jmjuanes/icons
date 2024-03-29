const rollup = require("rollup");
// const babel = require("@rollup/plugin-babel");
const babel = require("@babel/core");
const virtual = require("@rollup/plugin-virtual");
const path = require("node:path");

const {icons} = require("../icons.json");

// Transform for packages
const transforms = {
    react: {
        externals: ["react"],
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
            // return code.join("\n");
            return babel.transformSync(code.join("\n"), {
                presets: [
                    "@babel/preset-react",
                ],
            });
        },
    },
};

const build = pkg => {
    if (!pkg || !transforms[pkg]) {
        throw new Error("Please specify a package to build");
    }
    const transform = transforms[pkg];
    const outputFormats = ["esm", "cjs"];
    const inputOptions = {
        external: transform.externals,
        input: "index.jsx",
        plugins: [
            virtual({
                "index.jsx": transform.generateEntry().code,
            }),
            // babel(transform.babelConfig),
        ],
    };
    return rollup.rollup(inputOptions)
        .then(bundle => {
            const outputPromises = outputFormats.map(format => {
                return bundle.write({
                    file: path.join(process.cwd(), "packages", pkg, `index.${format}.js`),
                    format: format,
                });
            });
            return Promise.all(outputPromises);
        })
        .then(() => {
            console.log(`Build of package '${pkg}' finished`);
        });
};

build(process.argv.slice(2)[0]);
