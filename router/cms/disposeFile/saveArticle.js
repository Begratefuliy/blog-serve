//该模块用来保存文章，只处理数据

const fs = require('fs')

const sd = require('silly-datetime');

const fss = require('../../../tools/fss')

function saveArticle(dataObj, callback) {

  //获取时间戳，用来表示文件名
  let timeFile = Date.parse(new Date())
  let path = './article/' + dataObj.sort + '/' + timeFile + '.txt'
  let markdownPath = './article/' + dataObj.sort + '/markdown/' + timeFile + '.txt'
  let data = dataObj.content
  let markdownData = dataObj.markdownData
  let time = sd.format(new Date(), 'YYYY-MM-DD');
  let preview = dataObj.text
  let className = ''

  switch (dataObj.sort) {
    case 'yc': className = '原创'; break;
    case 'zz': className = '转载'; break;
    case 'rj': className = '日记'; break;
    case 'project': className = '项目'; break;
  }

  let comments = 0
  let pageview = 0
  let likenum = 0
  let adminNoCommentNumber = 0

  fss.write(path, data).then(() => {

    return fss.write(markdownPath, markdownData)

  }).then(() => {
    let result = {
      title: dataObj.title,
      sort: dataObj.sort,
      //类别的中文名称
      className,
      // 文件在服务器中的路径
      fileUrl: path,

      fileMarkdown: markdownPath,

      adminNoCommentNumber,

      //该文章所引用的所有图片地址
      imgUrl: dataObj.imgUrl,
      //时间
      time,
      //预览
      preview,

      //点赞数
      likenum,
      //阅读数
      pageview,
      //评论数
      comments
    }
    return callback(result)
  }).catch(() => {
    return callback("error")
  })


}



module.exports = saveArticle