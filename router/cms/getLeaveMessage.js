// 获取留言列表

const express = require('express')
const router = express.Router()
const token = require('../../token/token')
const LeaveMessage = require('../../database/leaveMessage')


//请求用户留言数据列表
router.get('/list', (req, res) => {
    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        LeaveMessage.getLeaveMessageList(req.query.page, req.query.itemNum, req.query.isreaded, (data) => {
            res.send(data)
        })


    })

})

//修改阅读状态
router.get('/read', (req, res) => {
    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        LeaveMessage.changeReaded(req.query.id, (data) => {
            data.then(() => {

                return res.send({ msg: '留言已阅读,该留言已置于已阅读中', status: 200 })
            }).catch(() => {
                return res.send({ msg: '服务器错误', status: 500 })
            })
        })


    })

})

//通过id删除留言
router.get('/delMessageById', (req, res) => {
    //获取用户请求头里的token
    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }


        LeaveMessage.delMessageById(req.query.id).then(() => {
            return res.send({ msg: '删除留言成功', status: 200 })
        }).catch(() => {
            return res.send({ msg: '删除留言失败', status: 500 })

        })

    })




})





module.exports = router