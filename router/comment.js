//该模块处理用户评论的信息

const express = require('express')
const router = express.Router()
const Comment = require('../database/comment')
const Article = require('../database/article')
const sd = require('silly-datetime')
const base = require('../base')
const url = require('url')
const fs = require('fs')
const admin = require('../rootinfo/admin.js')

//获取管理员信息
let adminInfo = {}
admin.getAdminInfo(function(data){
  adminInfo = data
})

//定义层主级别的回复
router.post('/replyByMain', (req, res) => {

  // 请求过来的数据
  let reqData = req.body

  // 文章id
  let articleId = reqData.articleId

  //时间
  let nowCommentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');

  //提交的信息
  let info = {
    // 层主评论
    userImg: base.baseIP + 'userimg/' + reqData.userImg,//头像
    userName: reqData.userName,//昵称
    commentTime: nowCommentTime,//发布时间
    commentCont: reqData.commentCont,//评论内容
    commentPoint: adminInfo.username,//层主评论的指向admin
    commentNumber: 0,//回复数量
    adminisComment: false,
  }

    Article.updateCommentNum(articleId,false,false,"sum").then(() => {
      Comment.addUserComment(articleId, info, (result) => {
        if (result.err) {
          return res.send({ msg: data.err, status: 500 })
        }
        result.then(() => {
          return res.send({ msg: '评论成功', status: 200, data: info })
        }).catch(() => {
          return res.send({ msg: '评论失败', status: 400 })
        })
      })
    }).catch((err) => {
      return res.send({ msg: '评论失败', status: 400,err })
    })
  
})



// 定义一个楼层中其他用户的评论
router.post('/replyByMainor', (req, res) => {
 
  // 请求过来的数据
  let reqData = req.body

  // console.log(reqData);

  // 文章id
  let articleId = reqData.articleId

  //楼层id
  let ceID = reqData.ceID

  //时间
  let nowCommentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');

  //当前回复的对象是否为管理员
  let replayObjIsadmin = reqData.replayObjIsadmin

  //此时发布层级下其他用户回复管理员的情况
  let replyOtherByAdmin = !!reqData.replyOtherByAdmin

  //提交的信息
  let info = {
    commentTime: nowCommentTime,//发布时间
    commentCont: reqData.commentCont,//评论内容
    commentPoint: reqData.commentPoint,//评论的指向
    isadmin:false
  }

  //此时为管理员回复
  if(reqData.isadmin){
    info.userImg = base.baseIP + 'rootimg/root.jpg' 
    info.userName = adminInfo.username
    info.isadmin = true
  }else{
    // 层主评论
    info.userImg = base.baseIP + 'userimg/' + reqData.userImg//头像
    info.userName = reqData.userName//昵称
  }



  //由于层主级别的回复使用了dom渲染的方式，并不是从服务器中请求的数据，所以此时ceID为undefined
  if (!reqData.ceID) {
    return res.send({ msg: '回复失败，请退出后重新回复', status: 400 })
  }

  //定义一个判断表示
  let isadm = 0

  Article.updateCommentNum(articleId,true,false,"sum").then(() => {
    //该回复对应的楼层id
    Comment.addOtherComment(articleId, reqData.ceID, info, (data) => {
      if (data.err) {
        return res.send({ msg: data.err, status: 500 })
      }
      data.then(() => {
        if (reqData.isadmin){
          isadm = 1
        //需要修改文章中未回复的数量和层主评论中adminisComment的属性
        return Article.updateCommentNum(articleId, false, true, "sub")
        }else{
          return 
        }
      }).then((data) => {
        if (isadm == 0){
          return
        }else{
          return Comment.changeAdminisComment(articleId, ceID)
        }
      }).then((data) => {
         //如果当前replayObjIsadmin为true，则添加一条记录
         if(replayObjIsadmin){
          return Comment.addReplyAdmin({
             articleId,
             ceID,
             userImg: base.baseIP + 'userimg/' + reqData.userImg,
             userName:reqData.userName,
             commentTime: nowCommentTime,
             commentCont: reqData.commentCont,
             commentPoint: reqData.commentPoint,
             adminisComment: false,
             oldreplyCon: reqData.oldreplyCon
           })
          }
      }).then((data) => {
        //增加未回复的数量
        if (replayObjIsadmin){
          return Article.updateCommentNum(articleId, false, true, "sum")
        }
      }).then((data) => {
        if (replyOtherByAdmin){
          let id = reqData.needDelId
          return Comment.delReplayAdminById(id)
        }
      }).then((data) => {
        info.ceID = reqData.ceID
        return res.send({ msg: '评论成功', status: 200, data: info })
      }).catch((err) => {
        console.log(err);
        res.send({ msg: '评论失败', status: 500 ,err})

      })
    })


  }).catch((err) => {

    return res.send({ msg: '评论失败', status: 400,err })

  })

})



//渲染层主的评论列表  
router.get('/getCommentList', (req, res) => {

  //获取需要加载的文章id
  let parseurl = url.parse(req.url, true)
  let obj = parseurl.query
  let articleId = obj.articleId

  //从数据库中查找评论列表
  Comment.getCommentList(articleId, (data) => {
    data.then((data) => {
      if (data.length == 0) {
        return res.send({ msg: '暂无评论', status: 201 })
      } else {
        return res.send({ msg: '查询成功', status: 200, list: data[0].itemArticleComment })
      }
    }).catch((err) => {
      return res.send({ msg: err, status: 500 })
    })
  })


})


//渲染其他用户的评论列表  
router.get('/getOtherCommentList', (req, res) => {

  //获取需要加载的楼层id
  let parseurl = url.parse(req.url, true)
  let obj = parseurl.query
  let ceId = obj.ceId

  //从数据库中查找评论列表
  Comment.getOtherCommentList(ceId, (data) => {
    data.then((data) => {
      if (data.length == 0) {
        return res.send({ msg: '暂无回复', status: 201 })
      } else {
        return res.send({ msg: '查询成功', status: 200, list: data[0].replyCon })
      }
    }).catch((err) => {
      return res.send({ msg: err, status: 500 })
    })
  })


})

//评论时获取头像列表数据
router.get('/getUserImgList', (req, res) => {
  let baseUrl = base.baseIP + 'userimg/'
  fs.readdir('./userimg', (err, file) => {
    if (err) {
      return res.send({ msg: '用户头像获取失败', status: 400 })
    }
    return res.send({ msg: '用户头像数据获取成功', status: 200, list: file, url: baseUrl })

  })


})


// 文章被点赞了
router.get('/giveLike', (req, res) => {

  //点赞的文章id
  //获取需要加载的楼层id
  let parseurl = url.parse(req.url, true)
  let obj = parseurl.query
  let articleId = obj.articleId

  Article.giveLike(articleId, (data) => {
    if (data.err) {
      return res.send({ msg: '服务器错误，点赞失败！', status: 400, articleId: articleId })
    }
    data.then((result) => {
      console.log(result);
      return res.send({ msg: '点赞成功，感谢支持', status: 200, articleId: articleId })
    }).catch((err) => {
      console.log(err);
      return res.send({ msg: 'err，点赞失败！', status: 400, articleId: articleId })
    })
  })



})



//获取含有管理员未回复的文章列表
router.get('/getAdminIsNoComList',(req,res) => {

  Article.getAdminIsNoComList().then((data) => {

    res.send({msg:"success",list:data,status:200})
  })


})


//根据文章id获取未回复的评论信息
router.get('/getNoComList',(req,res) => {

  let articleId = req.query.id

  Promise.all([Comment.getNocomInfo(articleId), Comment.getOtherNoCom(articleId)]).then((data) => {
    res.send({ msg: "查询成功", status: 200, list: data })
  }).catch((err) => {
    res.send({ msg: "查询失败", err, status: 500 })
  })


})





module.exports = router