// 敏感词相关接口

const express = require('express')
const router = express.Router()
const token = require('../../token/token')
const fss = require('../../tools/fss')


//添加敏感词
router.post('/add',(req,res) => {

  let needadd = req.body.data
  let url = './setting/sensitive.json'
  fss.read(url).then((data) => {
    let obj = JSON.parse(data)
    obj.data = needadd
    let string = JSON.stringify(obj)
    return fss.write(url,string)
  }).then(() => {
    res.send({msg:"敏感词修改成功",status:200})
  }).catch((err) => {
    res.send({ msg: "敏感词修改失败", status: 500,err })
  })

})

//获取敏感词
router.get('/getList',(req,res) => {
  let url = './setting/sensitive.json'
  fss.read(url).then((data) => {
    let obj = JSON.parse(data)
    return obj
  }).then((data) => {
    res.send({ msg: "敏感词查询成功", status: 200,data })
  }).catch((err) => {
    res.send({ msg: "敏感词查询失败", status: 500, err })
  })
})










module.exports = router