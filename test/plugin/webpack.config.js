const path = require('path');
const ZQiniuWebpackPlugin = require('../../index.js');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        filename: '[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new ZQiniuWebpackPlugin({
            maxConcurrent: 1,
            accessKey: '',
            secretKey: '',
            bucket: ''
        })
    ]
};
