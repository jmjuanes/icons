# Mochicons

## What is Mochicons?

**Mochicons** is a collection of hand-made and open source SVG icons that you can use in your web projects. Each icon has been designed in a 24x24 grid with a stroke width of 2px and a minimum padding of 2px.

Our icons can be easily integrated in your project just copying the SVG code or using one of our packages.

## Using Mochicons

The easiest way for using Mochicons is downloading or copying the icon that you need from the [icons](/icons) folder of this repository. Each icon consists in a `<svg>` tag and a single `<path>`.

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

## Packages

The following NPM packages are managed on this repository and provides additional ways of using **Mochicons**.

| Package | Version |
| ------- | ------- |
| **[@mochicons/node](/packages/node)** <br />Node.js API. | [![npm version](https://img.shields.io/npm/v/@mochicons/node.svg)](https://www.npmjs.org/package/@mochicons/node) |
| **[@mochicons/css](/packages/css)** <br />Include Mochicons using CSS classes. | [![npm version](https://img.shields.io/npm/v/@mochicons/css.svg)](https://www.npmjs.org/package/@mochicons/css) |
| **[@mochicons/react](/packages/react)** <br />Use Mochicons as React components. | [![npm version](https://img.shields.io/npm/v/@mochicons/react.svg)](https://www.npmjs.org/package/@mochicons/react) |

## License

Under the [MIT LICENSE](LICENSE).
