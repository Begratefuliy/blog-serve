//该模块用来发布文章，接受发布文章的请求

const express = require('express')
const saveArticle = require('./disposeFile/saveArticle')
const router = express.Router()
const Article = require('../../database/article')
const token = require('../../token/token')


router.post('/', (req, res) => {

    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        //得到请求数据，将数据处理
        saveArticle(req.body, (data) => {
            if (data === "error") {
                res.json({ msg: '数据处理失败', status: 400 })
            }
            //将处理好的数据保存到数据库中
            Article.addArticle(data).then((ret) => {
                return res.json({ msg: '发布成功', status: 200 })
            }).catch((err) => {
                res.json({ msg: '数据存储失败', status: 400 })
            })
        })


    })




})


module.exports = router