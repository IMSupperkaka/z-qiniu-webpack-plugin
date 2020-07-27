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
            accessKey: '0zn3jrk5z_zEVz-8rhAItN4NhA0kxaVvXKzhizxL',
            secretKey: 'Qn1ruQaPNwwaXMDBTSyhSYUcWeTywmTn8f4SNmcn',
            bucket: 'guozhongbao'
        })
    ]
};
