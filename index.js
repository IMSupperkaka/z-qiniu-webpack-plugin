const qiniu = require('./qiniu');

class zQiniuWebpackPlugin {

    constructor (option) {
        this.option = option;
    }

    apply(compiler) {
        // 注册afterEmit钩子函数 在完成输出资源至output目录后调用此函数
        compiler.hooks.afterEmit.tap('zQiniuWebpackPlugin:afterEmit', (compilation) => {
            const qiniuUploader = new qiniu({
                accessKey: this.option.accessKey,
                secretKey: this.option.secretKey,
                bucket: this.option.bucket
            });
            const { assets } = compilation;
            console.log(assets);
        })
    }

}

module.exports = zQiniuWebpackPlugin;
