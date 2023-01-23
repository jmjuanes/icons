# @fonticon/react



## Installation

Add this package to your project using **yarn**:

```bash
$ yarn add @fonticon/react
```

## Usage

This package exports each icon individually as [named exports](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_named_exports), so you can import the icons that you really need for your project:

```jsx
import React from "react";
import {CheckIcon} from "@fonticon/react";

export const App = () => (
    <CheckIcon />
);
```

### Customize icons

You can use the `color` and `font-size` properties of CSS to customize the icon color and size:

```jsx
import React from "react";
import {HomeIcon} from "@fonticon/react";

export const App = () => (
    <span style={{color: "blue", fontSize: "32px"}}>
        <HomeIcon />    
    </span>
);
```

## License

Under the [MIT LICENSE](https://github.com/jmjuanes/fonticon/blob/main/LICENSE).
