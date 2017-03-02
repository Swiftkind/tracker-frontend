var path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.js'
    },
    module: {
        loaders: [{ 
            test: /\.es6$/,
            loader: 'babel'
        }]
    }
};