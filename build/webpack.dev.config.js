const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {

    devtool: 'source-map',
    // 出口文件
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        host: "127.0.0.1",
        port: 9000,
        inline: true,
        hot: true,
        open: true,
        historyApiFallback: true,
        // disableHostCheck: true,
        // progress: true,
        // colors: true
    }
})