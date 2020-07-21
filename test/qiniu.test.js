const path = require("path");
const qiniu = require('../qiniu');

test('upload file', () => {
    const qiniuUploader = new qiniu({
        accessKey: '',
        secretKey: '',
        bucket: ''
    });
    return qiniuUploader.upload(path.resolve('./qiniutest.json'), 'qiniutest.json');
});
