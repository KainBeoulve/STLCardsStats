const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
require("babel-polyfill");

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "build"),
        historyApiFallback: true,
        publicPath: "/",
        compress: true,
        port: 9000,
        progress: true,
        hot: true
    },

    entry: ["babel-polyfill", "./src/index.js" ],

    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, 'build'),
        publicPath: "/"
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: "index.html",
            inject: "body"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        })
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
                        plugins: [
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },

    resolve: {
        alias: {
            "Source": path.resolve(__dirname, 'src')
        }
    },

    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                default: false,
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    priority: 2,
                    minChunks: 2
                },
                images: {
                    test: /\.(jp(e*)g|png|svg)$/,
                    name: "images",
                    chunks: "all",
                    priority: 1
                }
            }
        },
        sideEffects: true,
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ],
    }
};