//删除文件模块
const express = require('express')
const Article = require('../../database/article')
const router = express.Router()
const token = require('../../token/token')
const fss = require('../../tools/fss')

//获取文章的md字符串，用于编辑文章时显示
router.get('/getMdStr', (req, res) => {
  let mdStr = req.query.mdStr
  fss.read(mdStr).then((data) => {
    res.send({ msg: "文章md数据获取成功", status: 200, data })
  }).catch((err) => {
    res.send({ msg: "服务器错误！文章md数据获取失败", status: 500, err })
  })
})



//修改文章
router.post('/change', (req, res) => {
 // 获取用户请求头里的token
  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }

    let needChange = req.body

    //替换原有的txt内容,修改数据库信息
    fss.write(needChange.fileMarkdown, needChange.mdStr).then(() => {
      return fss.write(needChange.fileUrl, needChange.htmlStr)
    }).then(() => {
      return Article.updateAll(needChange)
    }).then(() => {
      res.send({ msg: "文章修改成功", status: 200 })
    }).catch((err) => {
      res.send({ msg: "服务器错误！文章修改失败", status: 500, err })
    })
  })

})


module.exports = router