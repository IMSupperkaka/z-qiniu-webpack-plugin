# z-qiniu-webpack-plugin

## 安装

```sh
yarn add z-qiniu-webpack-plugin -D
```

## 使用

### vue.config.js

```javascript
const ZQiniuWebpackPlugin = require('z-qiniu-webpack-plugin');

configureWebpack: {
    plugins: [
        new ZQiniuWebpackPlugin({
            accessKey: '', // 七牛accessKey
            secretKey: '', // 七牛secretKey
            bucket: '', // 七牛空间名
            bucketDomain: '', // 七牛空间域名
            maxConcurrent: 10, // 最大并发上传数量
            retryNum: 0, // 失败重新上传次数
            uploadPath: 'z_webpack_asstes', // 上传路径前缀
            usePublicPath: true, // 是否生成并使用publicpath
            useDev: false // 是否在development环境中使用
        })
    ]
},
```

## License

Copyright © [shawn](https://github.com/IMSupperkaka).
Released under the [MIT License](LICENSE).
