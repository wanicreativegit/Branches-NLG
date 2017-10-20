const webpack = require('webpack');

module.exports = {
    context: __dirname + "/src",
    entry: "./index.js",
    output: {
        filename: "app.js",
        path: __dirname + "/dist"
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }]
    }
}