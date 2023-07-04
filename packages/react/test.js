import TestRenderer from "react-test-renderer";

import * as Mochicons from "./index.js";

describe("@mochicons/react", () => {
    it("should export all icons as a react components", () => {
        expect(Object.keys(Mochicons)).toMatchSnapshot();
    });

    it("should wrap icons in a <svg> component", () => {
        const iconInstance = TestRenderer.create(<Mochicons.Icon />);

        expect(iconInstance.root.findByType("svg").props.width).toEqual(expect.stringContaining("1em"));
        expect(iconInstance.root.findByType("svg").props.height).toEqual(expect.stringContaining("1em"));
    });

    it("should wrap icons in a <g> component", () => {
        const iconInstance = TestRenderer.create(<Mochicons.Icon />);

        expect(iconInstance.root.findByType("g").props.stroke).toEqual(expect.stringContaining("currentColor"));
        expect(iconInstance.root.findByType("g").props.strokeWidth).toEqual(expect.stringContaining("2"));
    });
});
