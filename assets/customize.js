const el = query => document.querySelector(query);

// Create a blob object from string
const createBlob = (content, type) => {
    return new Blob([content], {
        type: type || "text/plain",
    });
};

// Download the provided blob object
const downloadBlob = (blob, filename) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", objectUrl);
    link.setAttribute("download", filename);
    // link.style.display = 'none'
    link.click();
};

// Convert blob to dataurl
const blobToDataUrl = blob => {
    return new Promise(resolve => {
        const file = new FileReader();
        file.onload = event => {
            return resolve(event.target.result);
        };
        return file.readAsDataURL(blob);
    });
};

// validate the provided color value
const isValidColor = color => {
    return (/^#([0-9A-F]{3}){1,2}$/i).test(color);
};

// Generate SVG icon
const generateSvgIcon = (width, height, color) => {
    const iconPath = el("div#iconPreview path").getAttribute("d");
    const iconContent = [
        `<!-- Icon downloaded from https://icons.josemi.xyz -->`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${width}" height="${height}">`,
        `<path fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/>`,
        `</svg>`,
    ];
    return iconContent.join("\n");
};

const generateCustomizedSvgIcon = () => {
    const iconWidth = parseInt(el("input#iconWidth")?.value || 24);
    const iconHeight = parseInt(el("input#iconHeight")?.value || 24);
    const iconColor = ("#" + (el("input#iconColor")?.value || "000")).replace("##", "#");
    return generateSvgIcon(iconWidth, iconHeight, isValidColor(iconColor) ? iconColor : "#000");
};

const downloadCustomizedSvgIcon = () => {
    const name = el("#iconName").textContent;
    const content = generateCustomizedSvgIcon();
    return downloadBlob(createBlob(content, "image/svg+xml"), `${name}.svg`);
};

const downloadCustomizedPngIcon = () => {
    console.log("DOWNLOADING PNG");
    const name = el("#iconName").textContent;
    const content = createBlob(generateCustomizedSvgIcon(), "image/svg+xml");
    const canvas = document.createElement("canvas");
    const img = new Image();
    // img.setAttribute("crossorigin", "anonymous");
    // img.crossOrigin = "anonymous";
    img.addEventListener("load", () => {
        // Set the canvas size to the total image size
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            return downloadBlob(blob, `${name}.png`);
        });
    });
    img.addEventListener("error", event => {
        console.error(event);
    });
    // Generate image
    blobToDataUrl(content).then(data => img.src = data);
};

// Register download events
el("div#downloadSvg").addEventListener("click", () => downloadCustomizedSvgIcon());
el("div#downloadPng").addEventListener("click", () => downloadCustomizedPngIcon());
