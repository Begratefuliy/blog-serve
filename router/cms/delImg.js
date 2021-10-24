//在发布文章时删除图片
const express = require('express')
const router = express.Router()
const fs = require('fs')
const token = require('../../token/token')


router.post('/', (req, res) => {
    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        //需要删除的图片地址
        let needDelImg = req.body.imgurl

        //将图片地址进行转换,转为文件名
        let needsearch = 'uploadimg/'
        needDelImg = needDelImg.slice(needDelImg.indexOf(needsearch) + needsearch.length)

        fs.unlink('./uploadimg/' + needDelImg, (err) => {
            if (err) {
                return res.send({ msg: '图片删除失败', status: 400 })
            }
            res.send({ msg: '图片删除成功', status: 200 })
        })



    })


   


})


module.exports = router