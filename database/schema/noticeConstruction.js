// 设置公告信息的集合模型
const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const noticeM = new Schema({
  title: { type: String, required: true },
  //内容的路径，markdown路径
  contUrl: { type: String, required: true },
  markdownUrl: { type: String, required: true },
  // 发布时间
  fbTime: { type: String, required: true },
  //公告持续时间
  duration: { type: String, required: true },
  //文件中用到的图片路径，可选
  imgUrl: { type: Array }

})


const Notice = mongoose.model('Notice', noticeM)



module.exports = Notice


