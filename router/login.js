const express = require('express')
const token = require('../token/token')
const router = express.Router()
const fss = require('../tools/fss')
const base = require('../base')
const sd = require('silly-datetime');
router.post('/', (req, res) => {

    const needLoginUser = req.body

    fss.read('./rootinfo/admin.json').then((rootdata) => {
     
        let rootname = JSON.parse(rootdata)['username']
        let rootpassword = JSON.parse(rootdata)['userpassword']
        let rootimg = base.baseIP+JSON.parse(rootdata)['userimg']
        if(needLoginUser.name == rootname && needLoginUser.password == rootpassword){
          let resu = token.encrypt(JSON.parse(rootdata), base.SECRET, 60*60*4)

            //记录访客的时间和ip
            let fktime = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
            let fkip = req.ip.replace('::ffff:', "")
            let jl = fkip + ":" + fktime + '\n'
            fss.addfile('./accessLog/fk.log', jl)

            res.send({ msg: '登录成功', name: needLoginUser.name,userimg:rootimg, status: 200, token: resu })
            return 
        }else{
            res.send({ msg: '账号或密码错误', status: 405 })
            return
        }
    }).catch((err) => {
        res.send({ msg: 'the server is error', status: 406 })
    })



    //从数据库中查用户  200成功  404密码错误  405用户不存在
    // user.queryUser(needLoginUser.name).then((data) => {
    //     // 如果有该用户则对比密码
    //     if(data){
    //         // 生成token
    //         const resu = token.encrypt(user, "nodejs", 60 * 60 * 2)
    //         needLoginUser.password === data.password ? res.send({ msg: 'ok',name:data.name, status: 200, token: resu }):
    //         res.send({ msg: 'the password error', status: 404 })
    //     }
    //     else{
    //         res.send({ msg: 'the user inexistence', status: 405 })
    //     }
    // })





})






module.exports = router