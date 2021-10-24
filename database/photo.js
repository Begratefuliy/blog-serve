// 图片处理模块
const Photo = require('./schema/photoConstruction')
const fss = require('../tools/fss')

//保存相册信息
exports.savePhoto = (data) => {
    return new Photo(data).save()
}

//获取相册列表
exports.getPhotoList = () => {
    return Photo.find()
}

//删除相册图片   http://192.168.1.119:5000/photo/save/small/1626535443000.png
exports.delPhoto = (id,path,callback) => {
    Photo.remove({_id:id}).then(() => {
       return fss.delfile(path.src)
    }).then(() => {
       return fss.delfile(path.msrc)
    }).then(() => {
        return callback({msg:'del is ok',status:200})
    }).catch(() => {
        callback({msg:'error',status:400})
    })
}