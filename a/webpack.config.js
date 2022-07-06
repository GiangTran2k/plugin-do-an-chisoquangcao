const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
    entry: {
        index: "./index.js",
    }, // File đầu vào
    output: {
        // File đầu ra
        filename: "[name].js", // Tên file đầu ra
        path: path.resolve(__dirname, "build"), // Nơi chưa file đầu ra
    },

    plugins: [
        new NodePolyfillPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "index.html" },
                { from: "style.css" },
            ],
        }),
    ],
};

module.exports = config;
