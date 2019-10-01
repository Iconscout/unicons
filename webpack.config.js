const path = require('path');

module.exports = {
    entry: [
      'regenerator-runtime/runtime',
      './scripts/monotone/script.js'
    ],
    target: 'node',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'script/monotone'),
        filename: 'bundle.js',
        publicPath: 'script/monotone/'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    }
}
