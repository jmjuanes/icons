const CleanCSS = require("clean-css");

// minify the provided css string
module.exports.minifyCss = (css = "", options = {}) => {
    return new CleanCSS(options).minify(css);
};

// generate an svg string with the provided icon path
module.exports.generateSvg = (p, size = "1em", separator = "") => {
    const items = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">`,
		`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p}"/>`,
		`</svg>`
	];
    return items.join(separator);
};

// encode SVG for using in CSS
// based on https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
module.exports.encodeSvg = str => {
	return str
		.replace(/"/g, "'")
		.replace(/%/g, "%25")
		.replace(/#/g, "%23")
		.replace(/</g, "%3C")
		.replace(/>/g, "%3E");
};
