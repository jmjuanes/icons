# Mochicons


## Using icons

The easiest way for using Mochicons is downloading or copying the icon that you need from the [icons](https://github.com/jmjuanes/mochicons/tree/main/icons) folder of this repository.

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

## CSS

Install the `@mochicons/css` package from npm:

```bash
$ yarn add @mochicons/css
```

Include the `mochicons.css` styles in your HTML file:

```html
<link rel="stylesheet" href="node_modules/@mochicons/css/mochicons.css">
```

Include the icons using the `m-*` class, and style it using CSS:

```html
<i class="m-tools" style="color:#025cca;font-size:24px;"></i>
```

## Node.js

Install the `@mochicons/node` package from npm:

```bash
$ yarn add @mochicons/node
```

You can access to each icon in your Node.js application:

```js
const mochicons = require("@mochicons/node");

console.log(mochicons.home);
// {
//     name: "home",
//     path: "M....",
//     toSVG: () => ...,
// }

```

## React

Install the `@mochicons/react` package from npm:

```bash
$ yarn add react @mochicons/react
```

Include each icon individually as a React component:

```jsx
import React from "react";
import {HomeIcon} from "@mochicons/react";

export const App = () => (
    <span style={{color: "blue", fontSize: "32px"}}>
        <HomeIcon />    
    </span>
);
```

## License

Under the [MIT LICENSE](LICENSE).
