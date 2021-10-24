const express = require('express')
const token = require('../token/token')
const router = express.Router()


router.get('/', (req, res) => {

  //获取用户请求头里的token
  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    } else {
      return res.send(data)
    }
  })

})






module.exports = router