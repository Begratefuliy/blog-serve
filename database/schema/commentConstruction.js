// 该模块用于设计用户评论的数据结构
const mongoose = require('mongoose')
const Schema = mongoose.Schema



//单层楼号的评论结构
const itemComment = new Schema({
    // 层主评论
    userImg: { type: String },//头像
    userName: { type: String },//昵称
    commentTime: { type: String },//发布时间
    commentCont: { type: String },//评论内容
    commentPoint: { type: String },//评论的指向
    commentNumber:{type:Number},//回复的数量
    adminisComment:{type:Boolean}//管理员是否回复

})



// 所有层主的评论模型
const userComments = new Schema({

    itemArticleComment: [itemComment],

    //该评论所对应的文章id
    articleId:{type:String}

})



//其他用户的评论信息 
const otherComments = new Schema({
       //该评论所对应的文章id
    articleId:{type:String},
    // 该层对应的id
    ceID: { type: String },
    replyCon:{type:Array}

})



//其他用户回复管理员的评论信息，用作记录使用,如果回复成功则将此记录删除
const adminComments = new Schema({
  //该评论所对应的文章id
  articleId: { type: String },
  // 该层对应的id
  ceID: { type: String },
  //回复的详情
  userImg: { type: String },//头像
  userName: { type: String },//昵称
  commentTime: { type: String },//发布时间
  commentCont: { type: String },//评论内容
  commentPoint: { type: String },//评论的指向
  commentNumber: { type: Number },//回复的数量
  adminisComment: { type: Boolean },//管理员是否回复
  oldreplyCon:{type:String},//管理员原先的评论信息
})


const UserComment = mongoose.model('UserComment', userComments)
const OtherComment = mongoose.model('OtherComment', otherComments)
const AdminComment = mongoose.model('AdminComment', adminComments)




exports.UserComment = UserComment
exports.OtherComment = OtherComment
exports.AdminComment = AdminComment


