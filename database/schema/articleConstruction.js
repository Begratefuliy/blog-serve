const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 存储文章信息的集合
const articleCollection = new Schema({
    //标题
    title: { type: String, required: true },
    // 类型
    sort: { type: String, required: true },
    //类型名称
    className:{type:String},
    // 文件对应的路径
    fileUrl: { type: String, required: true },
    //文件中用到的图片路径，可选
    imgUrl:{ type:Array},
    //发布的时间
    time:{type:String},
    //定义预览内容，用于文章列表的渲染
    preview:{type:String},
    //文章的评论数
    comments:{type:Number},
    //文章的阅读数
    pageview:{type:Number},
    // 文章的点赞数
    likenum:{type:Number},
    //存放文章markdown语句的文件路径，用于编辑文章时读取
    fileMarkdown:{type:String},
    //该文章管理员还没有回复的评论数
    adminNoCommentNumber:{type:Number}

})


const Article = mongoose.model('Article', articleCollection)



module.exports = Article


