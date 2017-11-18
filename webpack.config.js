const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
    // filename: "[name].[contenthash].css",
    filename: "[name].css",
	disable: process.env.NODE_ENV === "development"
});

const extractCss = new ExtractTextPlugin({
    // filename: "[name].[contenthash].css",
    filename: "[name].css",
	disable: process.env.NODE_ENV === "development"
});

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
                    fallback: "style-loader",
                    use: "css-loader"
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
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }            
        ]
    },
    
    plugins: [
        extractCss,
        extractSass,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            // In case you imported plugins individually, you must also require them here:
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
          })        
    ]
};