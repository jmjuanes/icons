import { SetStatePlugin, SetHelperPlugin } from "mikel";
import { defineConfig } from "mikel-cli";
import JSXPlugin from "mikel-jsx";
import pkg from "./package.json" with { type: "json" };
import icons from "./icons.json" with { type: "json" };

export default defineConfig({
    context: process.cwd(),
    input: [
        "gallery.html",
    ],
    output: {
        dir: "www",
        nameMapper: {
            "gallery.html": "index.html",
        },
    },
    plugins: [
        SetStatePlugin("pkg", {
            name: pkg.name,
            version: pkg.version,
            repository: pkg.repository.url,
        }),
        SetStatePlugin("site", {
            title: "josemi/icons",
            description: pkg.description,
            homepage: pkg.homepage,
            icons: icons.icons,
            categories: Array.from(new Set(icons.icons.map(icon => icon.category))),
            iconsCount: 100 * Math.floor(icons.icons.length / 100),
            header: {
                links: [
                    { text: "Download", url: `${pkg.repository.url}/releases` },
                    { text: "GitHub", url: pkg.repository.url },
                ],
            },
        }),
        SetHelperPlugin("icon", params => {
            return [
                `<svg width="1em" height="1em">`,
                `<use xlink:href="/icons.svg#${params.options?.icon || ""}"></use>`,
                `</svg>`,
            ].join("");
        }),
        SetHelperPlugin("each-icon", params => {
            const category = params.options.category || "*";
            const result = icons.icons.map(icon => {
                if (icon.category === category || category === "*") {
                    return params.fn(icon);
                }
                return "";
            });
            return result.join("");
        }),
        JSXPlugin(),
    ],
});
