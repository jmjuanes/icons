export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^(\\.{1,2}/.*)\\.(js|tsx)$": "$1",
    },
    setupFilesAfterEnv: [
        "@testing-library/jest-dom"
    ],
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleFileExtensions: ["tsx", "ts", "js", "jsx", "json", "node"],
};
