const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: [
      'regenerator-runtime/runtime',
      './scripts/monochrome/script.js'
    ],
    target: 'node',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'script/monochrome'),
        filename: 'bundle.js',
        publicPath: 'script/monochrome/'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin(['CI_COMMIT_REF_NAME'])
    ]
}
