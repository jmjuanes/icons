import { readFileSync, writeFileSync } from "node:fs";
import { Icon } from "./common.ts";

const build = () => {
    const iconsConfig: any = JSON.parse(readFileSync("icons.json", "utf8"));
    const icons = iconsConfig.icons as Icon[];
    const code = [
        `import type { JSX, ComponentType } from "react";\n`,
        `export type IconProps = {`,
        `    size?: string;`,
        `    color?: string;`,
        `    stroke?: number | string;`,
        `    path?: string;`,
        `};\n`,
        `export const Icon = ({size = "1em", color = "currentColor", stroke = 2, path = ""}: IconProps): JSX.Element => (`,
        `    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" data-testid="icon:svg">`,
        `        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} data-testid="icon:g">`,
        `            <path d={path} data-testid="icon:path" />`,
        `        </g>`,
        `    </svg>`,
        `);\n`,
        ...icons.map((icon: Icon) => {
            return [
                `export const ${icon.componentName}Icon = (props: Omit<IconProps, "path">): JSX.Element => {`,
                `    return (<Icon {...props} path={"${icon.path}"} />);`,
                `};`,
            ].join("\n");
        }),
        `const ICONS: Record<string, ComponentType> = {`,
        ...icons.map((icon: Icon) => {
            return `    "${icon.name}": ${icon.componentName}Icon,`;
        }),
        `};`,
        `export const renderIcon = (name: string): JSX.Element | null => {`,
        `    const Component = ICONS[name];`,
        `    if (!Component) return  null;`,
        `    return (<Component />);`,
        `};`,
    ];
    // write output
    writeFileSync("icons.tsx", code.join("\n"), "utf8");
};

build();
