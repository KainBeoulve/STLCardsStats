const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require("babel-polyfill");

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: true,
        port: 9000,
        progress: true,
        hot: true
    },

    entry: ["babel-polyfill", "./src/index.js" ],

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build')
    },

    plugins: [
        new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src/index.html')})
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env","@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    resolve: {
        alias: {Source: path.resolve(__dirname, 'src')}
    }
};