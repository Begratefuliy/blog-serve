const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 存储相册信息的集合
const photoCollection = new Schema({
    //大图路径
    src: { type: String, required: true },
    //小图路径
    msrc: { type: String, required: true },
    //图片打开后的宽度
    w:{type:String,require:true},
    //图片打开后的高度
    h:{type:String,require:true},
    //发布时间
    time:{type:String}



})


const Photo = mongoose.model('Photo', photoCollection)



module.exports = Photo


