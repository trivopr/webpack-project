const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
    // filename: "[name].[contenthash].css",
    filename: "[name].css",
    allChunks: true
});
const extractFonts = new ExtractTextPlugin({
    // filename: "[name].[contenthash].css",
    filename: "dist/font/[name].css",
    allChunks: true
});

const extractCss = new ExtractTextPlugin({
    filename: "[name].css"
});

const extractJs = new ExtractTextPlugin({
    filename: "[name].js",
	disable: process.env.NODE_ENV === "development"
});

const extractHTMLFile = new HtmlWebpackPlugin({
    title: 'Project Title',
    filename: 'dist/[name].html'
})

module.exports = {
    entry: './src/index.js',
    
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    devServer: {
        contentBase: './dist'
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractCss.extract({
                    use: [
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        }                        
                    ],
                    fallback: "style-loader"                    
                })           
            },

            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                plugins: function () { // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },{
                            loader: "sass-loader" // compiles Sass to CSS
                        }
                    ] ,       
                        // use style-loader in development
                    fallback: "style-loader"
                })
            },          

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },

            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                use: ['file-loader']
            },            
            
            {
                test: /\.(es6|js)$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /node_modules/
            }           
        ]
    },
    
    plugins: [
        extractCss,
        extractSass,
        extractJs,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
            
        }) 
    ]
};