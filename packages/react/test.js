import React from "react";
import TestRenderer from "react-test-renderer";
import {isElement} from 'react-dom/test-utils';

import * as Icons from "./index.js";

const createIcon = (props = {}) => {
    return TestRenderer.create(React.createElement(Icons.Icon, props));
};

describe("@josemi-icons/react", () => {
    describe("Icon", () => {
        it("should wrap icons in a <svg> component", () => {
            const iconInstance = createIcon({}); // TestRenderer.create(<Icons.Icon />);
            const svgElement = iconInstance.root.findByType("svg");

            expect(svgElement.props.width).toEqual("1em");
            expect(svgElement.props.height).toEqual("1em");
        });

        it("should wrap icons in a <g> component", () => {
            const iconInstance = createIcon({}); // TestRenderer.create(<Icons.Icon />);
            const groupElement = iconInstance.root.findByType("g");
    
            expect(groupElement.props.stroke).toEqual("currentColor");
            expect(groupElement.props.strokeWidth).toEqual(2);
        });

        it("should use the provided path as icon path", () => {
            const customPath = "__CUSTOM_PATH__";
            const iconInstance = createIcon({path: customPath}); // TestRenderer.create(<Icons.Icon path={customPath} />);
            const pathElement = iconInstance.root.findByType("path");

            expect(pathElement.props.d).toEqual(customPath);
        });

        it("should allow to change icons size", () => {
            const customSize = "128px";
            const iconInstance = createIcon({size: customSize}); // TestRenderer.create(<Icons.Icon size={customSize} />);
            const svgElement = iconInstance.root.findByType("svg");

            expect(svgElement.props.width).toEqual(customSize);
            expect(svgElement.props.height).toEqual(customSize);
        });

        it("should allow to change icon color", () => {
            const customColor = "#fff";
            const iconInstance = createIcon({color: customColor}); // TestRenderer.create(<Icons.Icon color={customColor} />);
            const groupElement = iconInstance.root.findByType("g");

            expect(groupElement.props.stroke).toEqual(customColor);
        });

        it("should allow to change icon stroke width", () => {
            const customStroke = 4;
            const iconInstance = createIcon({stroke: customStroke}); // TestRenderer.create(<Icons.Icon stroke={customStroke} />);
            const groupElement = iconInstance.root.findByType("g");

            expect(groupElement.props.strokeWidth).toEqual(customStroke);
        });
    });

    describe("renderIcon", () => {
        it("should return a React component", () => {
            const icon = Icons.renderIcon("line");

            expect(isElement(icon)).toBeTruthy();
        });

        it("should return the specified icon", () => {
            const iconPath = "M5 18L19 6";
            const iconInstance = TestRenderer.create(Icons.renderIcon("line"));
            const pathElement = iconInstance.root.findByType("path");

            expect(pathElement.props.d).toEqual(iconPath);
        });
    });
});
