const babel = require("@babel/core");
const {icons} = require("../../icons.json");

module.exports = {
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
};
