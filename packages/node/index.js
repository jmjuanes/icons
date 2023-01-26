const icons = require("./icons.json");

// Convert a string to kebab case
const kebabCase = str => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
};

// Tiny utility to generate html attributes
const htmlAttributes = attr => {
    return Object.keys(attr).map(key => `${kebabCase(key)}="${attr[key]}"`).join(" ");
};

Object.keys(icons).forEach(key => {

    // Register the toSVG function
    icons[key].toSVG = options => {
        const attributes = htmlAttributes({
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: options?.viewBox || "0 0 24 24",
            width: options?.size || "24",
            height: options?.size || "24",
            fill: "none",
            stroke: options?.stroke || "currentColor",
            strokeWidth: options?.strokeWidth || "2",
            strokeLinecap: options?.strokeLinecap || "round",
            strokeLinejoin: options?.strokeLinejoin || "round",
        });

        return `<svg ${attributes}><path d="${icons[key].path}" /></svg>`;
    };
});

module.exports = icons;
