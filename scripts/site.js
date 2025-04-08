import * as path from "node:path";
import press from "mikel-press";
import markdown from "mikel-markdown";
import hljs from "highlight.js";
import pkg from "../package.json" with {type: "json"};
import iconsConfig from "../icons.json" with {type: "json"};
import websiteConfig from "../website.config.json" with {type: "json"};

// custom configuration for markdown
const markdownConfig = markdown({
    classNames: {
        code: "font-mono font-bold text-sm px-1",
        heading: "font-heading mt-10 first:mt-0 mb-4 last:mb-0",
        paragraph: "mb-4",
        pre: "text-accent bg-primary rounded-xl p-4 font-mono text-xs overflow-x-auto mb-6",
    },
});

// convert string to pascal case
const pascalCase = str => {
    return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
};

// code blocks
const codeBlocks = {
    htmlUsage: {
        language: "html",
        code: icon => ([
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">`,
            `    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon.path}" />`,
            `</svg>`,
        ]),
    },
    reactUsage: {
        language: "jsx",
        code: icon => ([
            `import {${pascalCase(icon.name)}Icon} from "@josemi-icons/react";`,
            ``,
            `const MyComponent = () => {`,
            `    return (`,
            `        <${pascalCase(icon.name)}Icon />`,
            `    );`,
            `};`,
        ]),
    },
    cssUsage: {
        language: "html",
        code: icon => ([`<i class="ji-${icon.name}"></i>`]),
    },
};

// Custom plugin for generating icons pages
const IconsPagesPlugin = () => {
    const label = "page/icon";
    const templateContent = press.utils.read(path.resolve("docs/[icon].html"));
    return {
        name: "IconsPagesPlugin",
        load: context => {
            const folder = path.resolve(context.source, "./docs");
            return iconsConfig.icons.map(icon => {
                return press.createNode(folder, "icon/" + icon.name + ".html", label);
            });
        },
        transform: (_, node) => {
            if (node.label === label) {
                node.data.content = templateContent;
            }
        },
        shouldEmit: (_, node) => {
            return !node.path.includes("[icon]");
        },
        emit: (_, nodesToEmit) => {
            const iconsMap = Object.fromEntries(iconsConfig.icons.map(icon => {
                return [icon.name, icon];
            }));
            // inject icons data into nodes
            nodesToEmit.forEach(node => {
                if (node.label === label) {
                    node.data.attributes.icon = iconsMap[path.basename(node.path, ".html")];
                    node.data.attributes.title = path.basename(node.path, ".html");
                }
            });
        },
    };
};

press.build({
    ...websiteConfig,
    version: pkg.version,
    repository: pkg.repository.url,
    icons: iconsConfig.icons,
    iconsCount: Math.floor(iconsConfig.icons.length / 100)*100,
    plugins: [
        press.SourcePlugin({source: "./docs"}),
        IconsPagesPlugin(),
        press.FrontmatterPlugin({
            parser: JSON.parse,
        }),
        press.PermalinkPlugin(),
        press.ContentPlugin({
            layout: "./layout.html",
            functions: {
                icon: args => {
                    return [
                        `<svg width="1em" height="1em">`,
                        `<use xlink:href="/sprite.svg#${args.opt.icon}"></use>`,
                        `</svg>`,
                    ].join("");
                },
                code: args => {
                    const block = codeBlocks[args.opt.block];
                    return hljs.highlight(block.code(args.opt.icon).join("\n"), {language: block.language}).value;
                },
            },
            ...markdownConfig,
        }),
        press.CopyAssetsPlugin({
            patterns: [
                {
                    from: path.resolve("icons.json"),
                    to: "icons.json",
                },
                {
                    from: path.resolve("icons.schema.json"),
                    to: "icons.schema.json",
                },
                {
                    from: path.resolve("assets/customize.js"),
                    to: "customize.js",
                },
                {
                    from: path.resolve("node_modules/lowcss/low.css"),
                    to: "low.css",
                },
                {
                    from: path.resolve("node_modules/highlight.js/styles/nord.css"),
                    to: "highlight.css",
                },
                {
                    from: path.resolve("node_modules/@josemi-icons/svg/sprite.svg"),
                    to: "sprite.svg",
                },
            ],
        }),
    ],
});
