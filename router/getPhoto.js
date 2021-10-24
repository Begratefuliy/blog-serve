const express = require('express')
const router = express.Router()
//引入multer模块
const multer = require('multer')
//引入path模块，获取文件后缀名
const path = require('path')

const base = require('../base')
const sd = require('silly-datetime');

const Photo = require('../database/photo')

const token = require('../token/token')
const fss = require('../tools/fss')

//引入图片压缩模块
const smallPhoto = require('./cms/disposeFile/smallPhoto')
const { send } = require('process')



let imgname = ""
//生成一个仓库信息
const store = multer.diskStorage({
    //设置存储路径  // 参数1：本次请求信息，参数二：文件信息,参数三：回调函数
    destination: (req, file, callback) => {
        // null表示不对上传的文件流做修改，第二个参数为上传路径
        callback(null, './photo/temp')
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



//获取相册列表清单
router.get('/getphotolist', (req, res) => {

    Photo.getPhotoList().then((data) => {
        return res.send({msg:'success',status:200,list:data})
    }).catch((err) => {
        return res.send({ msg: 'getphoto is err', status: 500, err:err })
    })
   

})


//上传图片
router.post('/uploadphoto', fileUpload.single('photo'),(req,res) => {

  //获取用户请求头里的token
  let userToken = req.headers.authorization


  //检查token，如果有则正常返回，如果没有则将上传的文件删除
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      //删除文件
      fss.delfile('./photo/temp/' + imgname).then(() => {
        return res.status(400).send(data)
      }).catch(() => {
        return res.status(400).send(data)
      })

    } else {

      //当前上传的图片所在的地址
      let tempImgUrl = './photo/temp/' + imgname
      let bigImgUrl = './photo/save/big/' + imgname
      let smallImgUrl = './photo/save/small/' + imgname

      smallPhoto.diminish(tempImgUrl, bigImgUrl, smallImgUrl, (data) => {
        if (data.status == 200) {
          let newPhoto = {
            src: bigImgUrl.replace('./', base.baseIP),
            msrc: smallImgUrl.replace('./', base.baseIP),
            w: data.w,
            h: data.h,
            time: sd.format(new Date(), 'YYYY-MM-DD')
          }
          Photo.savePhoto(newPhoto).then(() => {
            return res.send({ msg: '相册图片上传成功', status: 200, data: newPhoto })
          }).catch(() => {
             res.status(500).send({ msg: '相册图片上传失败', status: 500 })
          })

        } else {
          res.status(500).send({ msg: '相册图片上传失败', status: 500 })
        }
      })

    }
  })

  

})


//删除图片
router.get('/delPhoto',(req,res) => {
    let path = {
        msrc:req.query.msrc.replace(base.baseIP,"./"),
        src: req.query.src.replace(base.baseIP, "./")
    }
    let id = req.query.id

  //获取用户请求头里的token
  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    } else {
      Photo.delPhoto(id, path, (data) => {
        if (data.status == 200) {
          res.send({ msg: data.msg, status: 200 })
        }
        else if (data.status == 400) {
          res.send({ msg: data.msg, status: 400 })

        }
      })

      
    }
  })

  

})






module.exports = router