module.exports = api => {
    // Prevent adding preset-env preset if we are not in a test env
    // This preset is required for testing but breaks the docs generation
    // See https://stackoverflow.com/questions/63563485/how-can-i-preserve-dynamic-import-statements-with-babel-preset-env 
    // See https://jestjs.io/docs/28.x/getting-started#using-babel 
    if (api.env("test")) {
        return {
            presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
            ],
        };
    }
    // Return default configuration, just for parsing jsx expressions in docs
    return {
        presets: ["@babel/preset-react"],
    }
};
