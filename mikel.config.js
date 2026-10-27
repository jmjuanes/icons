import mikel from "mikel";
import { defineConfig } from "mikel-cli";
import { CopyPlugin, ProgressPlugin } from "mikel-cli/plugins";
import JSXPlugin from "mikel-jsx";
import pkg from "./package.json" with { type: "json" };
import icons from "./icons.json" with { type: "json" };

export default defineConfig({
    context: process.cwd(),
    input: [
        "index.html",
    ],
    output: {
        dir: "www",
    },
    helpers: {
        "icon": params => {
            return [
                `<svg width="1em" height="1em">`,
                `<use xlink:href="/icons.svg#${params.options?.icon || ""}"></use>`,
                `</svg>`,
            ].join("");
        },
        // highlight: params => {
        //     const code = (params.options?.code || params.opt?.code).trim();
        //     const language = params.options?.language || params.opt?.language;
        //     return hljs.highlight(code, { language }).value;
        // },
    },
    plugins: [
        ProgressPlugin(),
        mikel.SetStatePlugin("site", {
            title: "josemi/icons",
            description: pkg.description,
            version: pkg.version,
            repository: pkg.repository?.url || pkg.repository,
            homepage: pkg.homepage,
            icons: icons.icons,
            iconsCount: 100 * Math.floor(icons.icons.length / 100),
        }),
        JSXPlugin(),
        CopyPlugin([
            {
                from: "icons.schema.json",
            },
            {
                from: "icons.svg",
            },
            {
                from: "node_modules/lowcss/low.css",
            },
        ]),
    ],
});
