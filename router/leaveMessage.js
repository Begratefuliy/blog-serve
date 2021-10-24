const express = require('express')
const router = express.Router()
const LeaveMessage = require('../database/leaveMessage')
const sd = require('silly-datetime')

router.post('/addLeaveMessage',(req,res) => {


    //时间
    req.body.time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    req.body.isreaded = false
    LeaveMessage.addLeaveMessage(req.body,(data) => {
        data.then((data) => {
           return res.send({msg:'发送成功，感谢反馈！',status:200})
        }).catch((err) => {
            return res.send({ msg: '服务器异常，提交失败！', errinfo:err,status: 500 })
        })
    })


})




module.exports = router