import { render, screen, act, fireEvent } from "@testing-library/react";
import { Icon, renderIcon } from "../icons.tsx";
import "@testing-library/jest-dom";

describe("josemi-icons/react", () => {
    describe("Icon", () => {
        it("should wrap icons in a <svg> component", () => {
            render(<Icon path="" />);
            expect(screen.getByTestId("icon:svg")).toBeInTheDocument();
        });

        it("should wrap icons in a <g> component", () => {
            render(<Icon path="" />);
            expect(screen.getByTestId("icon:g")).toBeInTheDocument();
        });

        it("should use the provided path as icon path", () => {
            const customPath = "__CUSTOM_PATH__";

            render(<Icon path={customPath} />);
            expect(screen.getByTestId("icon:path")).toHaveAttribute("d", customPath);
        });

        it("should allow to change icons size", () => {
            const customSize = "128px";

            render(<Icon path="" size={customSize} />);
            expect(screen.getByTestId("icon:svg")).toHaveAttribute("width", customSize);
            expect(screen.getByTestId("icon:svg")).toHaveAttribute("height", customSize);
        });

        it("should allow to change icon color", () => {
            const customColor = "#fff";

            render(<Icon path="" color={customColor} />);
            expect(screen.getByTestId("icon:g")).toHaveAttribute("stroke", customColor);
        });

        it("should allow to change icon stroke width", () => {
            const customStroke = 4;

            render(<Icon path="" stroke={customStroke} />);
            expect(screen.getByTestId("icon:g")).toHaveAttribute("stroke-width", customStroke.toString());
        });
    });

    describe("renderIcon", () => {
        it("should return a React component", () => {
            render(renderIcon("line"));
            expect(screen.getByTestId("icon:svg")).toBeInTheDocument();
        });

        it("should return the specified icon", () => {
            render(renderIcon("line"));
            expect(screen.getByTestId("icon:path")).toHaveAttribute("d", "M5 18L19 6");
        });
    });
});
