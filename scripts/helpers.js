import CleanCSS from "clean-css";

// minify the provided css string
export const minifyCss = (css = "", options = {}) => {
    return new CleanCSS(options).minify(css);
};

// generate an svg string with the provided icon path
export const generateSvg = (p, size = "1em", separator = "") => {
    const items = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">`,
		`    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p}"/>`,
		`</svg>`
	];
    return items.join(separator);
};

// @description tiny utility to extract the d="" segment from the icon
// @param {string} str - the SVG image content
// @returns {string} - the path of the icon
// @example extractIconPath('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>')
export const extractIconPath = str => {
    return str.match(/\sd="([^\"]*)"/im)[1].replace(/\+/g, " ");
};

// sort icons by name
export const sortIcons = icons => {
    return icons.sort((a, b) => a.name.localeCompare(b.name));
};

// encode SVG for using in CSS
// based on https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export const encodeSvg = str => {
	return str
		.replace(/"/g, "'")
		.replace(/%/g, "%25")
		.replace(/#/g, "%23")
		.replace(/</g, "%3C")
		.replace(/>/g, "%3E");
};
