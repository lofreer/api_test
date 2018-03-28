const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const sourcePath = path.resolve(__dirname, '../src')

const isDevelop = process.env.NODE_ENV === 'development'

module.exports = {
    // 入口文件
    entry:  {
        app: './src/app'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                exclude: /node_modules/,
                use: isDevelop ? 
                ['style-loader','css-loader?minimize', 'postcss-loader'] :
                ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'postcss-loader']
                })
            }, {
                test: /\.less/,
                use: isDevelop ?
                ['style-loader', 'css-loader?minimize', 'postcss-loader', 'less-loader?minimize'] :
                ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'postcss-loader', 'less-loader?minimize']
                })
            }, {
                test: /\.scss/,
                use: isDevelop ?
                ['style-loader', 'css-loader?minimize', 'postcss-loader', 'sass-loader?minimize'] :
                ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'postcss-loader', 'sass-loader?minimize']
                })
            }, {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg|md)$/,
                use: ['file-loader?limit=10000&name=img/[md5:hash:base64:10].[ext]']
            }, {
                test: /\.(eot|woff|ttf|woff2|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=img/svg+xml']
            }
        ]
    },
    resolve: {
        alias: {
            'routes': path.resolve(__dirname, '../src/routes'),
            'components': path.resolve(__dirname, '../src/components'),
            'constants': path.resolve(__dirname, '../src/constants'),
            'models': path.resolve(__dirname, '../src/models'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'services': path.resolve(__dirname, '../src/services'),
        },
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'],
        modules: [
            sourcePath,
            'node_modules'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __ORIGIN__: JSON.stringify(process.env.__ORIGIN__)
        }),
        new ExtractTextPlugin({ 
            filename: 'css/[name].css', 
            disable: false, 
            allChunks: true 
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: 'js/[name].js'
        })
    ]
}