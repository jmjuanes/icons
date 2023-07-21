const fs = require("node:fs");

describe("@josemi-icons/svg", () => {
    let target = null;

    beforeEach(() => {
        target = document.createElement("div");
        target.innerHTML = fs.readFileSync("./icons/activity.svg", "utf8");
        document.body.appendChild(target);
    });

    afterEach(() => {
        document.body.removeChild(target);
        target = null;
    });

    it("should render a valid <svg>", () => {
        const svg = document.querySelector("svg");

        expect(svg).not.toBeNull();
        expect(svg.getAttribute("xmlns")).toEqual("http://www.w3.org/2000/svg");
        expect(svg.getAttribute("width")).toEqual("1em");
        expect(svg.getAttribute("height")).toEqual("1em");
    });

    it("should render a <path>", () => {
        const path = target.querySelector("svg > path");

        expect(path).not.toBeNull();
        expect(path.getAttribute("d")).toEqual(expect.stringContaining("M"));
        expect(path.getAttribute("fill")).toEqual("none");
        expect(path.getAttribute("stroke")).toEqual("currentColor");
    });
});
