const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const runtime = require("react/jsx-runtime");
const matter = require("gray-matter");
const hljs = require("highlight.js/lib/common");

const {Icon, BarsIcon} = require("../packages/react/index.cjs.js");

const pkg = require("../package.json");
const icons = require("../icons.json");

const CodeBlock = props => {
    const className = "p-4 rounded-md bg-gray-900 text-white overflow-auto mb-8 text-sm font-mono";
    if (props.language) {
        return React.createElement("pre", {
            className: className,
            dangerouslySetInnerHTML: {
                __html: hljs.highlight(props.children, {language: props.language}).value,
            },
        });
    }
    return (
        <pre className={className}>{props.children}</pre>
    );
};

const NavbarLink = props => (
    <a href={props.to} className="flex items-center gap-2 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 no-underline">
        {props.icon && (
            <div className="flex items-center text-xl">
                <Icon icon={props.icon} />
            </div>
        )}
        <div className="font-medium">
            {props.text || props.children}
        </div>
    </a>
);

const pageComponents = {
    "h1": props => <h1 className="mt-8 mb-4 text-gray-800 text-2xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-800 text-xl font-bold">{props.children}</h2>,
    "p": props => <p className="mt-6 mb-6">{props.children}</p>,
    "a": props => (
        <a {...props} className={props.className || `underline text-gray-900 hover:text-gray-700`}>
            {props.children}
        </a>
    ),
    "code": props => <code className="font-bold text-sm font-mono">{`'`}{props.children}{`'`}</code>,
    Icon: props => <Icon icon={props.icon} />,
    Separator: () => <div className="w-full h-px bg-gray-200 my-10" />,
    CodeBlock: CodeBlock,
    Fragment: React.Fragment,
};

const PageWrapper = props => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
            <meta name="title" content="josemi/icons" />
            <meta name="description" content="Enhance your projects with beautifully crafted SVG icons." />
            <meta property="og:site_name" content="josemi/icons" />
            <meta property="og:title" content="josemi/icons" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://icons.josemi.xyz" />
            <meta property="og:image" content="https://icons.josemi.xyz/og.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="josemi/icons" />
            <meta property="description" content="Enhance your projects with beautifully crafted SVG icons." />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:author" content="@jmjuanes" />
            <meta name="twitter:title" content="josemi/icons" />
            <meta name="twitter:description" content="Enhance your projects with beautifully crafted SVG icons." />
            <meta name="twitter:image" content="https://icons.josemi.xyz/og.png" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="./low.css" />
            <link rel="stylesheet" href="./highlight.css" />
            <title>{`${props?.page?.data?.title ? `${props.page.data.title} - ` : ""} josemi/icons v${pkg.version}`}</title>
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-800 leading-normal">
            {/* Header */}
            <div className="border-b-1 border-gray-300">
                <div className="w-full maxw-7xl h-16 px-6 mx-auto flex items-center justify-between">
                    <a href="./index.html" className="flex items-center gap-2 text-gray-800 no-underline">
                        <div className="font-bold flex items-center">
                            <span>josemi/</span>
                            <span className="text-gray-500">icons</span>
                        </div>
                        <div className="flex items-center font-bold text-2xs bg-gray-200 px-2 py-1 rounded-lg">
                            <span>v{pkg.version}</span>
                        </div>
                    </a>
                    <div className="group peer" tabIndex="0">
                        <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                            <BarsIcon />
                        </div>
                        <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block group-focus-within:block z-5">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center rounded-md bg-white p-4 sm:p-0 w-72 sm:w-auto">
                                <div className="pr-12 sm:pr-0 sm:flex sm:gap-3">
                                    <NavbarLink to="./usage.html" text="Usage" icon="book-open" />
                                </div>
                                <div className="h-px w-full sm:h-8 sm:w-px bg-gray-300" />
                                <div className="flex">
                                    <NavbarLink to={pkg.repository.url}>
                                        <img className="w-6 h-6" src="./github.svg" />
                                    </NavbarLink>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed top-0 left-0 w-full h-full sm:h-0 peer-focus-within:block hidden sm:hidden bg-gray-900 o-60 z-2" />
                </div>
            </div>
            {/* Main content */}
            <div className="w-full maxw-7xl mx-auto px-6">
                {props.page?.data?.layout === "page" && (
                    <div className="mx-auto maxw-4xl w-full">
                        <div className="my-10">
                            <div className="text-5xl font-black">{props.page.data.title}</div>
                            <div className="mt-0 text-lg text-gray-500 font-medium leading-relaxed">{props.page.data.description}</div>
                        </div>
                        {props.element}
                    </div>
                )}
                {props.page?.data?.layout === "default" && (
                    <React.Fragment>
                        {props.element}
                    </React.Fragment>
                )}
            </div>
            {/* Footer */}
            <div className="w-full maxw-7xl mx-auto px-6 pt-10 pb-20">
                <div className="text-sm">
                    Designed by <a href="https://josemi.xyz" target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">Josemi</a>. 
                    Source code available on <a href={pkg.repository.url} target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">GitHub</a>.
                </div>
            </div>
        </body>
    </html>
);

import("@mdx-js/mdx").then(mdx => {
    const inputFolder = path.join(process.cwd(), "docs");
    const outputFolder = path.join(process.cwd(), "www");
    const log = msg => console.log(`[docs] ${msg}`);
    log("Starting build...");
    log("Reading .mdx files from 'docs/' folder.");
    fs.readdir(inputFolder)
        .then(files => files.filter(file => path.extname(file) === ".mdx"))
        .then(files => {
            return Promise.all(files.map(file => {
                const filePath = path.join(inputFolder, file);
                return fs.readFile(filePath, "utf8").then(fileContent => {
                    const {data, content} = matter(fileContent);
                    return {
                        data: data,
                        content: content,
                        fileName: path.basename(file, ".mdx") + ".html",
                    };
                });
            }));
        })
        .then(pages => {
            const templatePage = pages.find(page => page.fileName.startsWith("["));
            const iconsPages = Object.keys(icons).map(icon => ({
                data: {
                    ...templatePage.data,
                    title: icon,
                    icon: icons[icon],
                },
                content: templatePage.content,
                fileName: `${icon}.html`,
            }));
            return [
                ...pages.filter(page => !page.fileName.startsWith("[")),
                ...iconsPages,
            ];
        })
        .then(pages => {
            const buildPromises = pages.map(page => {
                return mdx.evaluate(page.content, {...runtime})
                    .then(pageComponent => {
                        const pageContent = React.createElement(PageWrapper, {
                            element: React.createElement(pageComponent.default, {
                                page: page,
                                components: pageComponents,
                                icons: Object.values(icons),
                                version: pkg.version,
                                repository: pkg.repository.url,
                            }),
                            page: page,
                            pages: pages,
                        });
                        return renderToStaticMarkup(pageContent);
                    })
                    .then(content => {
                        return fs.writeFile(path.join(outputFolder, page.fileName), content, "utf8");
                    })
                    .then(() => {
                        log(`Saved file to 'www/${page.fileName}'.`);
                    });
            });
            return Promise.all(buildPromises);
        })
        .then(() => log("Build finished."));
});
