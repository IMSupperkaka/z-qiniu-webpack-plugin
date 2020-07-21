const ProgressBar = require('progress');
const qiniu = require('./qiniu');

const defaultOption = {
    maxConcurrent: 10, // 最大并发上传数量
    retryNum: 0 // 失败重新上传次数 
}

class zQiniuWebpackPlugin {

    constructor (option = {}) {
        this.option = {
            ...defaultOption,
            ...option
        };
    }

    apply(compiler) {
        // 注册afterEmit钩子函数 在完成输出资源至output目录后调用此函数
        compiler.hooks.afterEmit.tap('ZQiniuWebpackPlugin:afterEmit', (compilation) => {
            const { assets } = compilation;
            const assetsList = [];
            for ( let filename in assets) {
                assetsList.push({
                    filename: filename,
                    filepath: assets[filename].existsAt
                });
            }
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
        const queue = assetsList.splice(0, this.option.maxConcurrent);
        const result = {
            success: 0,
            fail: 0
        }
        const tickBar = (index) => {
            const fisrAssest = assetsList[0];
            bar.tick();
            queue[index].status = 'done';
            if (fisrAssest) {
                queue.push(fisrAssest);
                upload(fisrAssest);
                assetsList.splice(0, 1);
            }
            if (this.isFinish()) {
                console.log('z.上传结束');
                console.log(`上传成功 ${result.success}`);
                console.log(`上传失败 ${result.fail}`);
            }
        }
        const upload = ({ filename, filepath }, index) => {
            this.uploadSingle(qiniuUploader, filepath, filename, this.option.retryNum).then(() => {
                result.success++;
                tickBar(index);
            }).catch(() => {
                result.fail++;
                tickBar(index);
            });
        }
        queue.map(upload);
    }

    isFinish(list) {
        return list.filter((v) => {
            return v.status !== 'done';
        }).length == 0;
    }

    uploadSingle(qiniuUploader, filepath, filename, retryNum) {
        return new Promise((resolve, reject) => {
            qiniuUploader.upload(filepath, filename).then(resolve).catch(() => {
                if (retryNum <= 0) {
                    resolve();
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
