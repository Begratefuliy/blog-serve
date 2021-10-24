// 获取留言列表

const express = require('express')
const router = express.Router()
const token = require('../../token/token')
const Recommend = require('../../database/recommend')



//添加阅读列表
router.post('/addRecommend', (req, res) => {

    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }
        Recommend.addRecommend(req.body).then(() => {
            return res.send({ msg: 'addrecommend is success', status: 200 })
        }).catch(() => {
            return res.send({ msg: 'addrecommend is error', status: 400 })
        })

    })
})


//获取阅读列表
router.get('/getList', (req, res) => {

    Recommend.getList().then((data) => {
        return res.send({ msg: 'getRecommendList is success', status: 200, list: data })
    }).catch(() => {
        return res.send({ msg: 'getRecommendList is error', status: 400 })
    })

})


//删除文章列表
router.post('/del', (req, res) => {


    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }
        Recommend.del(req.body.list).then(() => {
            return res.send({ msg: 'delRecommendList is success', status: 200 })
        }).catch(() => {
            return res.send({ msg: 'delRecommendList is error', status: 400 })
        })

    })

})






module.exports = router