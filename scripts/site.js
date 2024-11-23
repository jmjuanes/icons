const fs = require("node:fs");
const path = require("node:path");
const frontMatter = require("front-matter");
const hljs = require("highlight.js/lib/common");

const pkg = require("../package.json");
const {icons} = require("../icons.json");

// code blocks
const codeBlocks = {
    htmlUsage: {
        language: "html",
        code: icon => ([
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">`,
            `    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon.path}" />`,
            `<svg/>`,
        ]),
    },
    reactImport: {
        language: "jsx",
        code: icon => ([`import {${icon.componentName}Icon} from "@josemi-icons/react";`]),
    },
    reactUsage: {
        language: "jsx",
        code: icon => ([
            `const ${icon.componentName}Icon = () => (`,
            `    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">`,
            `        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="${icon.path}" />`,
            `    </svg>`,
            `);`,
        ]),
    },
};

// get pages from specified folder
const getPages = folder => {
    const allFiles = fs.readdirSync(folder, "utf8")
        .filter(file => path.extname(file) === ".html")
        .map(file => {
            const content = frontMatter(fs.readFileSync(path.join(folder, file), "utf8"));
            return {
                name: path.basename(file, ".html"),
                url: path.join("/", path.basename(file, ".html")),
                data: content.attributes,
                content: content.body,
            };
        });
    // compile icons
    const iconTemplate = allFiles.find(file => file.name === "[icon]");
    const allIconsFiles = icons.map(icon => {
        return Object.assign({}, iconTemplate, {
            name: icon.name,
            url: path.join("/", icon.name),
            data: Object.assign({}, iconTemplate.data, {
                title: icon.name,
                icon: icon,
            }),
        });
    });
    // return all pages
    return [
        ...allFiles.filter(file => !file.name.startsWith("[")),
        ...allIconsFiles,
    ];
};

// global data object
const globalData = {
    site: {
        version: pkg.version,
        title: pkg.title,
        description: pkg.description,
        repository: pkg.repository.url,
    },
    data: {
        icons: icons,
        iconsCount: Math.floor(icons.length / 100)*100,
    },
    pages: getPages(path.join(process.cwd(), "docs")),
    page: null,
};

// @description read a markdown file
// const readMarkdownFile = file => {
//     const fileContent = fs.readFileSync(file, "utf8");
//     const page = frontMatter(fileContent);
//     return {
//         name: path.basename(file, ".md"),
//         content: marked.parse(page.body || ""),
//         data: page.attributes || {},
//         url: page.attributes?.permalink || path.join("/", path.basename(file, ".md") + ".html"),
//     };
// };

// @description build site
const build = async () => {
    const mikel = (await import("mikel")).default;
    const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
    // 2. Generate documentation pages
    globalData.pages.forEach(page => {
        globalData.page = page; // set current page
        const content = mikel(template, globalData, {
            partials: {
                content: page.content,
            },
            functions: {
                icon: args => {
                    return `<svg width="1em" height="1em"><use xlink:href="/sprite.svg#${args.opt.icon}"></use></svg>`;
                },
                code: args => {
                    const block = codeBlocks[args.opt.block];
                    return hljs.highlight(block.code(args.opt.icon).join("\n"), {language: block.language}).value;
                },
            },
        });
        console.log(`[build:site] saving file to www${page.url}.html`);
        fs.writeFileSync(path.join(process.cwd(), "www", page.url + ".html"), content, "utf8");
    });
};

build();
