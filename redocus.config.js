const fs = require("node:fs/promises");
const path = require("node:path");
const React = require("react");
const classnames = require("classnames");
const hljs = require("highlight.js/lib/common");

const {renderIcon, BarsIcon} = require("./packages/react/index.cjs.js");

const pkg = require("./package.json");
const {icons} = require("./icons.json");

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

const MenuSection = props => (
    <div className="text-gray-800">{props.children}</div>
);

const MenuGroup = props => (
    <div className="font-bold mb-1 capitalize px-3">{props.text}</div>
);

const MenuLink = props => {
    const classList = classnames({
        "block py-2 px-3 rounded-md no-underline": true,
        "bg-gray-100 font-bold text-gray-800": props.active,
        "bg-white hover:bg-gray-100 hover:text-gray-800": !props.active,
    });
    return (
        <a href={props.href} className={classList}>
            <span className="text-sm">{props.text}</span>
        </a>
    );
};

const NavbarLink = props => (
    <a href={props.to} className="flex items-center gap-2 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 no-underline">
        {props.icon && (
            <div className="flex items-center text-lg">
                {renderIcon(props.icon)}
            </div>
        )}
        <div className="flex items-center font-medium text-sm">
            {props.text || props.children}
        </div>
    </a>
);

const pageComponents = {
    "h1": props => <h1 className="mt-8 mb-4 text-gray-900 text-2xl font-bold">{props.children}</h1>,
    "h2": props => <h2 className="mt-8 mb-4 text-gray-900 text-xl font-bold">{props.children}</h2>,
    "p": props => <p className="mt-6 mb-6">{props.children}</p>,
    "a": props => (
        <a {...props} className={props.className || `underline text-gray-800 hover:text-gray-900 font-medium`}>
            {props.children}
        </a>
    ),
    "code": props => <code className="font-bold text-sm font-mono">{`'`}{props.children}{`'`}</code>,
    Icon: props => renderIcon(props.icon), // <Icon path={props.icon} />,
    Separator: () => <div className="w-full h-px bg-gray-200 my-10" />,
    CodeBlock: CodeBlock,
    Fragment: React.Fragment,
};

const DocsLayout = props => {
    const current = props.page.path;
    return (
        <div className="flex w-full">
            <div className="hidden lg:block w-56 shrink-0">
                <div className="w-full py-12 flex flex-col gap-6 sticky top-0">
                    <MenuSection>
                        <MenuGroup text="Getting Started" />
                        <MenuLink active={current === "installation.html"} href="./installation" text="Installation" />
                        <MenuLink active={current === "usage.html"} href="./usage" text="Usage" />
                    </MenuSection>
                    <MenuSection>
                        <MenuGroup text="Integrations" />
                        <MenuLink active={current === "react.html"} href="./react" text="React" />
                    </MenuSection>
                </div>
            </div>
            <div className="w-full max-w-3xl mx-auto py-10">
                <div className="mb-10">
                    <div className="text-4xl font-bold text-gray-900 mb-1">{props.page.data.title}</div>
                    <div className="text-lg text-gray-800 font-medium leading-relaxed">
                        <span>{props.page.data.description}</span>
                    </div>
                </div>
                {props.element}
            </div>
        </div>
    );
};

const PageWrapper = props => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
            <meta name="title" content={props.site.title} />
            <meta name="description" content={props.site.description} />
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
            <title>{`${props?.page?.data?.title ? `${props.page.data.title} - ` : ""} josemi/icons v${props.site.version}`}</title>
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-700 leading-normal">
            {/* Header */}
            <div className="border-b-1 border-gray-100">
                <div className="w-full max-w-7xl h-16 px-6 mx-auto flex items-center justify-between">
                    <a href="./" className="flex items-center gap-2 text-gray-900 no-underline">
                        <div className="font-bold flex items-center">
                            <span>josemi/</span>
                            <span className="text-gray-600">icons</span>
                        </div>
                        <div className="flex items-center font-bold text-2xs bg-gray-100 px-2 py-1 rounded-lg">
                            <span>v{props.site.version}</span>
                        </div>
                    </a>
                    <div className="group peer" tabIndex="0">
                        <div className="flex sm:hidden text-xl p-2 border border-gray-200 rounded-md cursor-pointer">
                            <BarsIcon />
                        </div>
                        <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block group-focus-within:block z-5">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center rounded-md bg-white p-4 sm:p-0 w-72 sm:w-auto">
                                <div className="pr-12 sm:pr-0 sm:flex sm:gap-3">
                                    <NavbarLink to="./installation" text="Installation" icon="rocket" />
                                    <NavbarLink to="./usage" text="Usage" icon="book-open" />
                                    <NavbarLink to="./react" text="Icons + React" icon="atom" />
                                </div>
                                <div className="h-px w-full sm:h-8 sm:w-px bg-gray-200" />
                                <div className="flex">
                                    <NavbarLink to={props.site.repository}>
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
            <div className="w-full max-w-7xl mx-auto px-6 pb-16">
                {props.page?.data?.layout === "docs" && (
                    <DocsLayout {...props} />
                )}
                {props.page?.data?.layout === "default" && (
                    <div className="w-full">
                        {props.element}
                    </div>
                )}
            </div>
            {/* Footer */}
            <div className="w-full border-t border-gray-100 text-gray-600">
                <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-20 text-sm">
                    Designed by <a href="https://josemi.xyz" target="_blank" className="text-gray-800 hover:text-gray-900 font-medium underline">Josemi</a>. 
                    Source code available on <a href={props.site.repository} target="_blank" className="text-gray-800 hover:text-gray-900 font-medium underline">GitHub</a>.
                </div>
            </div>
        </body>
    </html>
);

module.exports = {
    input: "docs",
    output: "www",
    siteMetadata: {
        title: "josemi/icons",
        description: "Enhance your projects with beautifully crafted SVG icons.",
        version: pkg.version,
        repository: pkg.repository,
        icons: icons,
    },
    pageComponents: pageComponents,
    pageWrapper: PageWrapper,
    onPageCreate: ({page, actions}) => {
        if (page.name.startsWith("[")) {
            actions.deletePage(page);
            icons.forEach(icon => {
                return actions.createPage({
                    ...page,
                    data: {
                        ...page.data,
                        title: icon.name,
                        icon: icon,
                    },
                    name: icon.name,
                    path: `${icon.name}.html`,
                    url: `./${icon.name}`,
                });
            });
        }
    },
};
