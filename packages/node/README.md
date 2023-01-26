# @mochicons/node

## Installation

Add this package to your project using **yarn**:

```bash
$ yarn add @mochicons/node
```

## Usage

You can access to the metadata of each icon in your Node.js application:

```js
const mochicons = require("@mochicons/node");

console.log(mochicons.home);
// {
//     name: "home",
//     path: "M....",
//     toSVG: () => ...,
// }

```

## API

### `mochicos[key].name`

This is just the name of the icon.

### `mochicons[key].path`

This contains the SVG path data of the icon (see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

### `mochicons[key].toSVG()`

A function that returns the `<svg>` string of the icon. 

```js
mochicos.home.toSVG();
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">...</svg>
```

This function accepts an options object as an argument, that can be used to customize the generated SVG. The following options can be provided:

##### `size`

The size of the icon. This value will be used for the `width` and `height` attributes of the SVG. Default value is `24`.

```js
mochicons.home.toSVG({
    size: "32",
})
// <svg width="32" height="32">...</svg>
```

##### `stroke`

Custom stroke color for the SVG. Default is `currentColor`.

##### `strokeWidth`

Custom stroke width for the SVG. Default is `2`.


## License

Under the [MIT LICENSE](https://github.com/jmjuanes/mochicons/blob/main/LICENSE).
