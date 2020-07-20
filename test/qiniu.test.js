const path = require("path");
const qiniu = require('../qiniu');

test('upload file', () => {
    const qiniuUploader = new qiniu({
        accessKey: '0zn3jrk5z_zEVz-8rhAItN4NhA0kxaVvXKzhizxL',
        secretKey: 'Qn1ruQaPNwwaXMDBTSyhSYUcWeTywmTn8f4SNmcn',
        bucket: 'guozhongbao'
    });
    return qiniuUploader.upload(path.resolve('./qiniutest.json'), 'qiniutest.json');
});