const ProgressBar = require('progress');
const path = require('path');
const url = require('url');
const qiniu = require('./qiniu');
const limitMap = require('./utils/limit-map');

const defaultOption = {
    maxConcurrent: 10, // 最大并发上传数量
    retryNum: 0, // 失败重新上传次数
    uploadPath: 'z_webpack_asstes',
    bucketDomain: '',
    usePublicPath: true,
    useDev: false
}

class zQiniuWebpackPlugin {

    constructor(option = {}) {
        this.option = {
            ...defaultOption,
            ...option
        };
    }

    apply(compiler) {
        if (process.env.NODE_ENV && process.env.NODE_ENV == 'development') {
            return;
        }
        compiler.hooks.beforeRun.tapAsync('ZQiniuWebpackPlugin:beforeRun', (compiler, callback) => {
            const { usePublicPath, bucketDomain, uploadPath } = this.option;
            if (usePublicPath) {
                compiler.options.output.publicPath = url.resolve(bucketDomain, uploadPath);
            }
            callback();
        });
        // 注册afterEmit钩子函数 在完成输出资源至output目录后调用此函数
        compiler.hooks.afterEmit.tap('ZQiniuWebpackPlugin:afterEmit', (compilation) => {
            const { assets } = compilation;
            const assetsList = [];
            for (let filename in assets) {
                assetsList.push({
                    filename: path.join(this.option.uploadPath, filename),
                    filepath: assets[filename].existsAt
                });
            }
            console.log(assetsList);
            this.uploadQueue(assetsList);
        })
    }

    uploadQueue(assetsList) {
        const qiniuUploader = new qiniu({
            accessKey: this.option.accessKey,
            secretKey: this.option.secretKey,
            bucket: this.option.bucket
        });
        const bar = new ProgressBar('z.上传中 [:bar] :rate/bps :percent :etas', {
            total: assetsList.length,
            complete: '=',
            incomplete: ' ',
            width: 20
        });
        const result = {
            success: 0,
            fail: 0
        }
        limitMap(assetsList, this.option.maxConcurrent, ({ filepath, filename }, callback) => {
            this.uploadSingle(qiniuUploader, filepath, filename, this.option.retryNum).then((res) => {
                result.success++;
                bar.tick();
                callback();
            }).catch(() => {
                result.fail++;
                bar.tick();
                callback();
            });
        }, (list) => {
            console.log('z.上传结束');
            console.log(`上传成功 ${result.success}`);
            console.log(`上传失败 ${result.fail}`);
        });
    }

    uploadSingle(qiniuUploader, filepath, filename, retryNum) {
        return new Promise((resolve, reject) => {
            qiniuUploader.upload(filepath, filename).then(resolve).catch((e) => {
                if (retryNum <= 0) {
                    reject(e);
                } else {
                    this.uploadSingle(qiniuUploader, filepath, filename, --retryNum)
                        .then(resolve)
                        .catch(reject);
                }
            })
        })
    }

}

module.exports = zQiniuWebpackPlugin;
