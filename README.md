# josemi-icons

A collection of hand-made and open source SVG icons that you can use in your web projects. Each icon has been designed in a 24x24 grid with a stroke width of 2px and a minimum padding of 2px.

This package provides SVG icons in multiple formats, including React components, CSS variables (data URIs), and SVG sprites.

![npm version](https://badgen.net/npm/v/josemi-icons?labelColor=1d2734&color=21bf81)
![license](https://badgen.net/github/license/jmjuanes/josemi?labelColor=1d2734&color=21bf81)

## Features

- **Multiple Formats**: React components, CSS, SVG Sprite, and JSON metadata.
- **Highly Customizable**: Control size, color, and stroke width with ease.
- **Tree Shakeable**: Only include the icons you actually use in your React project.
- **Premium Design**: Consistent 24x24 grid with a clean, modern aesthetic.

## Installation

Add the icons package to your project by running:

```bash
## using npm
$ npm install josemi-icons

## using yarn
$ yarn add josemi-icons

## using pnpm
$ pnpm add josemi-icons
```

## Usage

The easiest way is downloading or copying the icons from https://josemi.xyz/icons. Each icon consists in a `<svg>` tag and a single `<path>`.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M...."
    />
</svg>
```

You can also include the icons as images in a `<img>` element using a public CDN:

```html
<img src="https://unpkg.com/josemi-icons/icons/activity.svg" />
```

### React

The React distribution provides individual components for each icon, a base `Icon` component, and a `renderIcon` utility.

#### Individual Components

```tsx
import { AccessPointIcon, ActivityIcon } from "josemi-icons/react";

const MyComponent = () => (
    <div>
        <AccessPointIcon size="24px" color="blue" stroke={2} />
        <ActivityIcon size="1.5em" color="currentColor" />
    </div>
);
```

#### Base Icon Component

If you have the icon path data, you can use the base `Icon` component:

```tsx
import { Icon } from "josemi-icons/react";

const CustomIcon = () => (
    <Icon path="M..." size="24px" color="red" stroke={1.5} />
);
```

#### Dynamic Rendering

Use `renderIcon` to render icons dynamically by their name:

```tsx
import { renderIcon } from "josemi-icons/react";

const DynamicIcon = ({ name }) => {
    return renderIcon(name) || <span>Icon not found</span>;
};
```

### CSS

The CSS distribution provides icons as data URIs. You can use them via CSS classes or directly via CSS variables.

1. Import the CSS:

```css
@import "josemi-icons/css";
```

#### Class-based Usage

Use the `ji-` prefix followed by the icon name:

```html
<i class="ji-access-point" style="color: blue; font-size: 24px;"></i>
```

#### CSS Variable Usage

This is perfect for use in `background-image` or `mask-image`:

```css
.my-element {
  width: 24px;
  height: 24px;
  background: var(--josemi-icons-access-point) no-repeat center;
  background-size: contain;
}
```

### SVG Sprite

For projects using SVG sprites, you can reference symbols directly from `icons.svg`.

```html
<svg width="24" height="24">
  <use href="node_modules/josemi-icons/icons.svg#access-point"></use>
</svg>
```

### Metadata & Schema

If you are building your own tools or need icon metadata, you can use the JSON distribution:

```javascript
import iconsMetadata from "josemi-icons/json";

console.log(iconsMetadata.icons); // Array of { name, path }
```

A JSON Schema is also provided at `josemi-icons/schema`.

## Customization

Icons are designed on a **24x24** grid. Most icons support the following props (in React) or equivalent CSS properties:

- **Size**: Defaults to `1em`.
- **Color**: Defaults to `currentColor`.
- **Stroke**: Defaults to `2`. Supports numeric values for `stroke-width`.

## License

Code is licensed under the [MIT LICENSE](../LICENSE).

Icons in this repository are [Public Domain](https://creativecommons.org/publicdomain/zero/1.0/). You can use, copy, modify, distribute, or display the icons without any restrictions or attribution requirements. They are offered on an "as-is" basis, without warranties or conditions of any kind.

By using the icons in this repository, you agree that they are provided without any warranty, and the author(s) shall not be liable for any claim, damages, or other liability arising from the use of the icons.
