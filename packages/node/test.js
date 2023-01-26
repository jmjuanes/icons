import mochicons from "./index.js";

describe("@mochicons/node", () => {
    it("should export icons", () => {
        expect(Object.keys(mochicons).length).toBeGreaterThan(0);
    });

    it("should provide a 'path' field with the icon path", () => {
        Object.keys(mochicons).forEach(key => {
            expect(typeof mochicons[key].path === "string").toBeTruthy();
        });
    });

    it("should provide a 'toSVG' function to generate the icon in SVG", () => {
        Object.keys(mochicons).forEach(key => {
            expect(typeof mochicons[key].toSVG === "function").toBeTruthy();
        });
    });

    it("should generate a valid SVG using the 'toSVG' function", () => {
        Object.keys(mochicons).forEach(key => {
            const svg = mochicons[key].toSVG();

            expect(typeof svg === "string").toBeTruthy();
            expect(svg).toEqual(expect.stringMatching(/^<svg/));
            expect(svg).toEqual(expect.stringMatching(/xmlns="http:\/\/www.w3.org\/2000\/svg"/));
            expect(svg).toEqual(expect.stringMatching(/width="24"/));
            expect(svg).toEqual(expect.stringMatching(/height="24"/));
            expect(svg).toEqual(expect.stringMatching(new RegExp(`d="${mochicons[key].path}"`)));
            expect(svg).toEqual(expect.stringMatching(/<\/svg>$/));
        });
    });

    it("should allow to customize the icon width and height", () => {
        Object.keys(mochicons).forEach(key => {
            const svg = mochicons[key].toSVG({size: "16"});

            expect(svg).toEqual(expect.stringMatching(/width="16"/));
            expect(svg).toEqual(expect.stringMatching(/height="16"/));
        });
    });

    it("should allow to customize the icon stroke color", () => {
        Object.keys(mochicons).forEach(key => {
            const svg = mochicons[key].toSVG({stroke: "black"});

            expect(svg).toEqual(expect.stringMatching(/stroke="black"/));
        });
    });
});
