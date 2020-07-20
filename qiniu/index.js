
const qiniu = require('qiniu');

class Qiniu {

    constructor(option) {
        this.option = option;
        // 七牛token凭证
        this.token = null;
    }

    upload(filepath, filename) {
        const token = this.buildToken(this.option.bucket, filename);
        const config = new qiniu.conf.Config();
        const formUploader = new qiniu.form_up.FormUploader(config);
        const putExtra = new qiniu.form_up.PutExtra();
        return new Promise((resolve, reject) => {
            formUploader.put(token, filename, filepath, putExtra, (respErr, respBody, respInfo) => {
                if (!respErr) {
                    if (respInfo.statusCode == 200) {
                        resolve(respBody);
                    } else {
                        reject(respBody);
                    }
                } else {
                    reject(err);
                }
            });
        })
    }

    buildToken(bucket, key) {
        const mac = new qiniu.auth.digest.Mac(this.option.accessKey, this.option.secretKey);
        const putPolicy = new qiniu.rs.PutPolicy({
            scope: bucket + ":" + key
        });
        this.token = putPolicy.uploadToken(mac);
        return this.token;
    }

}

module.exports = Qiniu;