//上传文件模块

const express = require('express')
const router = express.Router()

//引入multer模块
const multer = require('multer')

//引入path模块，获取文件后缀名
const path = require('path')

const token = require('../../token/token')

const fss = require('../../tools/fss')


let imgname = ""


//生成一个仓库信息
const store = multer.diskStorage({
    //设置存储路径  // 参数1：本次请求信息，参数二：文件信息,参数三：回调函数
    destination: (req, file, callback) => {

        // null表示不对上传的文件流做修改，第二个参数为上传路径
        callback(null, './uploadimg')
    },
    filename: (req, file, callback) => {

        //获取文件后缀名
        let suffix = path.extname(file.originalname)

        //获取时间戳与后缀名进行拼接
        imgname = Date.parse(new Date()) + suffix

        callback(null, imgname)
    }
})

//配置接收器
const fileUpload = multer({ storage: store })
router.post('/', fileUpload.single('file'), (req, res) => {

  //获取用户请求头里的token
  let userToken = req.headers.authorization

  //检查token，如果有则正常返回，如果没有则将上传的文件删除
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      //删除文件
      fss.delfile('./uploadimg/' + imgname).then(() => {
        return res.status(400).send(data)
      }).catch(() => {
        return res.status(400).send(data)
      })
   
    } else {
      res.json({
        "errno": 0,
        "data": [
          {
            url: req.protocol + '://' + req.headers.host + "/uploadimg/" + imgname,
            alt: "no data",
            href: ""
          }

        ]
      })
    }
  })

   
})




module.exports = router