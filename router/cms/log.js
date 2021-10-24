//更新日志文档路由
const express = require('express')
const router = express.Router()
const token = require('../../token/token')
const log = require('../../database/log')
const sd = require('silly-datetime')
const fss = require('../../tools/fss')
// 添加日志
router.post('/addLog', (req, res) => {

    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }
 
        let time = sd.format(new Date(), 'YYYY-MM-DD');
        log.addLog({ time, type: req.body.type, cont: req.body.cont }).then(() => {
            return res.send({ msg: '日志添加成功', status: 200 })
        }).catch((err) => {
            return res.send({ msg: '日志添加失败', err, status: 500 })
        })

    })


  

})


//获取日志
router.get('/getLogList',(req,res) => {
    log.getLogList().then((data) => {
        return res.send({ msg: '日志查询成功',list:data, status: 200 })
    }).catch((err) => {
        return res.send({ msg: '日志查询失败', err, status: 500 })
    })
})


//更改个人介绍
router.post('/setIntroduction',(req,res) => {

    let userToken = req.headers.authorization
    let checkResult = token.checkToken(token, userToken, (data) => {
        if (data.status === 400) {
            return res.send(data)
        }

        let datas = { cont: req.body.cont }
        fss.write('./rootinfo/introduction.json', JSON.stringify(datas)).then(() => {
            return res.send({ msg: '修改成功', status: 200 })

        }).catch((err) => {
            return res.send({ msg: err, status: 500 })
        })

    })

  
})


//获取个人介绍
router.get('/getIntroduction',(req,res) => {
    fss.read('./rootinfo/introduction.json').then((info) => {
        let data = JSON.parse(info)
        return res.send({ msg: '查询成功', data, status: 200 })
    }).catch((err) => {
        return res.send({ msg: '查询失败',err, status: 500 })

    })
})


module.exports = router