//添加/删除评论模块

const comment = require('./schema/commentConstruction')


//层主回复信息后自动添加对应的评论模块，参数：文章id,评论的对象,回调函数
exports.addUserComment = (articleId, commentInfo, callback) => {

    // 查找当前数据库里有没有存放该评论信息，如果有则直接添加评论对象，没有则创建
    comment.UserComment.find({ articleId: articleId }).then((data) => {
        if (data.length == 0) {
            let newUserComment = new comment.UserComment({
                itemArticleComment: [],
                articleId
            })
            newUserComment.itemArticleComment.push(commentInfo)
            callback(newUserComment.save())

        }
        else {
            //如果有新的评论则更新文档
            //获取原先的评论数据

            let olditemArticleComment = data[0].itemArticleComment
            olditemArticleComment.push(commentInfo)
            let updatacom = comment.UserComment.updateOne({ articleId: articleId }, { itemArticleComment: olditemArticleComment })
            callback(updatacom)

        }
    }).catch(() => {
        callback({ err: '服务器错误' })
    })



}



//同层其他用户回复信息后自动添加对应的评论模块，参数：文章id，楼层id,评论的对象,回调函数
exports.addOtherComment = (articleId, itemArticleCommentId, commentInfo, callback) => {

  //当前楼层有多少回复量
  let commentNumberT

    // 查询该楼层是否已经有了评论
    comment.OtherComment.find({ ceID: itemArticleCommentId }).then((data) => {
        // 如果之前没有创建过
        if (data.length == 0) {
            let newotherComment = new comment.OtherComment({
                articleId: articleId,
                ceID: itemArticleCommentId,
                replyCon: []
            })
           
            return newotherComment.save()
        }
        return Promise.resolve()
    }).then(() => {

        comment.OtherComment.findOne({ ceID: itemArticleCommentId }).then((data) => {

          commentNumberT = data.replyCon.length
            let oldreplyinfo = data.replyCon
            oldreplyinfo.push(commentInfo)
      
            return comment.OtherComment.update({ ceID: itemArticleCommentId }, { replyCon: oldreplyinfo})

        }).then(() => {
           
            //更新原楼层里的回复数量
            comment.UserComment.findOne({articleId:articleId}).then((datas) => {
                let data = datas.itemArticleComment
               
                //定义一个变量用来接收需要改变的楼层值
                let needChange = {}
                //需要改变值的索引
                let needIndex
               let newData= data.filter((currentValue,index) => {
                   if (currentValue['_id'] == itemArticleCommentId){
                       needChange = currentValue
                       needIndex = index
                    
                   }
                   return currentValue['_id'] != itemArticleCommentId
                })
               

              needChange.commentNumber = commentNumberT+1
                newData.splice(needIndex,0,needChange)

                let addnumber = comment.UserComment.updateOne({ articleId: articleId }, { itemArticleComment: newData})
                callback(addnumber)
           
            })

          
        
            

        }).
        catch((err) => {
            console.log(err);
            callback({ err: '服务器错误' })
        })
 

    }).catch(() => {
        callback({ err: '服务器错误' })
    })


}



//获取层主评论列表,参数文章id
exports.getCommentList = (articleId,callback) => {
    callback(comment.UserComment.find({ articleId: articleId }))
}


//获取其他用户评论列表，参数楼层id
exports.getOtherCommentList = (ceId,callback) => {
    callback(comment.OtherComment.find({ceID:ceId}))
}

//获取层主中未回复的评论
exports.getNocomInfo = (articleId) => {
  return comment.UserComment.findOne({articleId}).then((data) => {
    let list = data.itemArticleComment
    //将列表中的 adminisComment 属性为 false 的过滤处理
    let newList = list.filter(function(item) {
      return item.adminisComment == false
    })
    return newList
  })

}


//修改层评论中的adminisComment属性
exports.changeAdminisComment = (articleId,ceID) => {
  return comment.UserComment.findOne({articleId}).then((data) => {
    let list = data.itemArticleComment
    //获取到符合条件的元素
    let newlist = list.map(function(item){
      if(item._id == ceID){
        item.adminisComment = true
      }
      return item
    })
    return comment.UserComment.updateOne({ articleId: articleId }, { itemArticleComment:newlist})
  })
}


//在管理员回复层主后如果有其他人回复则添加一条记录用作保存
exports.addReplyAdmin = (info) => {
  return new comment.AdminComment(info).save()
}


//删除一条记录
exports.delReplayAdminById = (id) => {
  return comment.AdminComment.remove({_id:id})
}

//在其他用户回复管理员的集合中获取未回复的数据
exports.getOtherNoCom = (articleId) => {
  return comment.AdminComment.find({articleId})
}

