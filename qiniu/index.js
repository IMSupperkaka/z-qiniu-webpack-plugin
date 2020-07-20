
const qiniu = reauire('qiniu');

class Qiniu {

    constructor(option) {
        this.accessKey = option.accessKey;
        this.secretKey = option.secretKey;
        this.bucket = option.bucket;
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    }

    upload(filepath) {
        const options = {
            scope: this.bucket
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);
        const config = new qiniu.conf.Config();
        const formUploader = new qiniu.form_up.FormUploader(config);
    }

}