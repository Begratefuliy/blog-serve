// 公告处理模块
const Notice = require('./schema/noticeConstruction')
const base = require('../base')
const fs = require('fs')

//添加新公告
exports.addNewNotice = (data) => {
  return new Notice({ title: data.title, contUrl: data.contUrl, markdownUrl: data.markdownUrl, fbTime: data.fbTime, duration: data.duration, imgUrl: data.imgUrl }).save()
}

//获取公告列表
exports.getNoticeList = () => {
  return Notice.find()
}


//删除公告 参数：包含需要删除公告的id数组
exports.delNotice = (arr) => {
  //删除文章信息
  try{
    arr.forEach((item) => {
      fs.unlinkSync(item.contUrl)
      fs.unlinkSync(item.markdownUrl)
      if(item.imgUrl.length>0){
        item.imgUrl.forEach((item) => {
          fs.unlinkSync(item.replace(base.baseIP,'./'))
        })
      }
    })

  }catch(err){
    return new Promise((resolve,reject) => {
      reject(err)
    })
  }
  
  let newarr = arr.map((item) => {
    return item._id
  })
  return Notice.deleteMany({ _id: { $in: newarr } })
}


//根据id获取公告的详情
exports.getNoticeInfoById = (id) => {
  return Notice.findOne({_id:id})
}


