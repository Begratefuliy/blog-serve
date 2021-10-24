// 该模块用来压缩上传的图片

//引入图片压缩模块
const images = require("images");
const fs = require('fs')

//参数：图片原始路径，压缩后大图路径 ， 压缩后小图路径，回调函数
let diminish = (path, bigPath,smallPath, callback) => {

    if (!fs.existsSync(path)) {
        return callback({ status: 500, msg: 'not find file' })
    }

    let ischange = false
    //如果该图片的宽度大于1000，则进行压缩
    let imgSize = images(path).size()

    // 1.生成预览小图
    images(path).size(imgSize.width / 3, imgSize.height / 3).save(smallPath, {
        quality: 30                    //保存图片到文件,图片质量为50
    });
    //2.计算出图片的比例，默认宽度固定为600
    let imgH = parseInt(600 * (imgSize.height / imgSize.width))

    imgSize.width > 1200 ? ischange = true : ischange = false
    if (ischange) {
        images(path).size(imgSize.width / 2, imgSize.height / 2).save(bigPath, {
            quality: 50                    //保存图片到文件,图片质量为50
        });

    } else {
        images(path).size(imgSize.width, imgSize.height).save(bigPath, {
            quality: 80
        });  
    }

    //删除临时文件,存在删除，不存在不管
    fs.unlink(path, (err) => {
        if (err) {
            return callback({ status: 500, msg: err })
        }
        return callback({ status: 200, msg: 'success', w: '600', h: imgH.toString() })
    });

}


exports.diminish = diminish
