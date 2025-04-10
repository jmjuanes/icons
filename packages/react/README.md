![@josemi-icons/react](./header.png)

![npm version](https://badgen.net/npm/v/@josemi-icons/react?labelColor=1d2734&color=21bf81)
![license](https://badgen.net/github/license/jmjuanes/icons?labelColor=1d2734&color=21bf81)


## Installation

Add this package to your project using **yarn** or **npm**:

```bash
$ yarn add react @josemi-icons/react
```

## Usage

This package exports each icon individually as [named exports](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_named_exports), so you can import the icons that you really need for your project:

```jsx
import React from "react";
import {CheckIcon} from "@josemi-icons/react";

export const App = () => (
    <CheckIcon />
);
```

### Customize icon using props

You can use the following props to customize the icon:

| Prop name | Description | Type | Default value |
|-----------|-------------|------|---------------|
| `size`    | The icon size. | String | `"1em"` |
| `color`   | The icon color. | String | `"currentColor"` |
| `stroke` | The width of the stroke to be applied to the icon path. | String or Number | `2` |

Example: 

```jsx
import React from "react";
import {LineIcon} from "@josemi-icons/react";

export const App = () => (
    <LineIcon color="#eaeaea" size="32px" />
);
```

### Customize icons using CSS

You can use the `color` and `font-size` properties of CSS to customize the icon color and size:

```jsx
import React from "react";
import {HomeIcon} from "@josemi-icons/react";

export const App = () => (
    <span style={{color: "blue", fontSize: "32px"}}>
        <HomeIcon />    
    </span>
);
```

## License

Under the [MIT LICENSE](https://github.com/jmjuanes/icons/blob/main/LICENSE).
