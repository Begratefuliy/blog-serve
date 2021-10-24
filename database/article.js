
const Article = require('./schema/articleConstruction')
const fs = require('fs')
const fss = require('../tools/fss')

//导出添加文章到数据库的方法
//参数：articleObj  需要保存的数据
exports.addArticle = function addArticle(articleObj) {
  let newArticle = new Article(articleObj)
  return newArticle.save()
}


//导出获取文章列表的方法
//参数：type 文章类型（yc,zz,rj）    page 页码，从0开始，  listNumber 每次获取的数量 ,如果为0，则获取全部
exports.getArticleList = function getArticleList(type, page1, listNumber1, callback) {

  //将转换类型，防止意外
  let page = parseInt(page1)
  let listNumber = parseInt(listNumber1)

  Article.find({ sort: type }, (err, Articledata) => {
    if (err) {
      callback('error')
    }
    else {
      let data = Articledata.reverse()
      // 总共搜寻的数据数量
      let allNumber = data.length

      if (listNumber != 0) {

        if (data.slice(page * listNumber).length <= listNumber) {
          let newList = data.slice(page * listNumber)
          //over 表示已经没有数据了
          callback(newList, "over")
          return
        }
        let newList = data.slice(page * listNumber, (page * listNumber) + listNumber)
        //continue 表示还有数据，可以继续请求
        callback(newList, "continue")
        return
      }
      //获取所有数据,all表示获取了所有数据
      callback(data, "all")
    }

  })
}

//导出删除文章的方法
exports.delArticleById = function (id, callback) {

  //1.删除article文件夹下的对应文件  2.删除uploading文件夹下的对应图片  3.从数据库中删除该文档

  //通过该id查询该条数据

  Article.findById(id, (err, data) => {
    if (err) {
      callback({ msg: 'find is error', status: 400 })
      return
    }
    if (data.fileUrl != "") {
      //删除文件
      fss.delfile(data.fileUrl).then(() => {
        return fss.delfile(data.fileMarkdown)
      }).then(() => {
        //删除文件引用的图片
        if (data.imgUrl != []) {
          for (item of data.imgUrl) {
            //    console.log(item);
            let path = item.split('/')[item.split('/').length - 1]
            fs.unlinkSync('./uploadimg/' + path)
          }
        }
        return
      }).then(() => {
        //删除数据库记录
        return Article.remove({ _id: id })
      }).then(() => {
        return callback({ msg: 'operation is sucess', status: 200 })
      }).catch(() => {
        callback({ msg: 'unlink is error', status: 400 })
      })
    }
  })
}

//点赞文章
exports.giveLike = (articleId, callback) => {
  //获取原先的点赞数量
  Article.findById(articleId).then((data) => {
    let oldnum = data.likenum
    oldnum++
    return callback(Article.update({ _id: articleId }, { likenum: oldnum }))
  }).catch(() => {
    return callback({ err: '点赞数查询失败' })
  })

}


//评论后修改文章管理员未回复的数量和文字的总评论数，参数：文章id   是否只修改评论数  是否只改变层信息  计算方式（sum增加或减少sub）
exports.updateCommentNum = (articleId, onlyChangeCom,onlyChangeCeCom,compuMode) =>{

  let compu = 0
  if(compuMode == "sum"){
    compu = 1
  }else if(compuMode == "sub"){
    compu = -1
  }
  

  // 文章的总评论数
  let allComNum
  return Article.findById(articleId).then((data) => {
    allComNum = data.comments
    return data.adminNoCommentNumber
  }).then((data) => {
    if (!onlyChangeCom){
      let newN = data + compu
      return Article.findByIdAndUpdate(articleId, { adminNoCommentNumber: newN })
    }
  }).then(() => {
    if (!onlyChangeCeCom){
      let newAll = allComNum + compu
      return Article.findByIdAndUpdate(articleId, { comments: newAll })
    }
  })

}


//获取含有管理员未回复的文章列表

exports.getAdminIsNoComList = () => {

  return Article.find({ adminNoCommentNumber: { $gte: 1 } })
}



//编辑文章后更新所有数据
exports.updateAll = (data) => {
  return Article.updateOne({_id:data._id},data)
}



