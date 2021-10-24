//删除文件模块
const express = require('express')
const Article = require('../../database/article')
const router = express.Router()
const token = require('../../token/token')




router.post('/',(req,res) => {
    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        Article.delArticleById(req.body.id, (result) => {
            if (result.status == 200) {
                res.send(result)
            }

            else if (result.status == 400) {
                res.send(result)
            }

        })

    })


  


})


module.exports = router