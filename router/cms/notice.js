//公告路由
const express = require('express')
const router = express.Router()
const token = require('../../token/token')
const notice = require('../../database/notice')
const sd = require('silly-datetime')
const fss = require('../../tools/fss')
const plan = require('../../plan/noticePlan')
const dayjs = require('dayjs')

// 添加新公告
router.post('/addNewNotice', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }

    let cont = req.body.cont
    let markdownCont = req.body.markdownCont
    //将数据存储到服务器中并返回路径
    let path = './article/notice/' + (new Date()).getTime() + '.txt'
    let markdownPath = './article/notice/markdown/' + (new Date()).getTime() + '.txt'
    fss.write(path, cont).then(() => {
      return fss.write(markdownPath, markdownCont)
    }).then(() => {
      let writeData = {
        title: req.body.title,
        contUrl: path,
        markdownUrl: markdownPath,
        fbTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm'),
        duration: req.body.duration,
        imgUrl: req.body.imgUrl
      }
      return notice.addNewNotice(writeData)
    }).then((data) => {
      return res.send({ msg: '公告发布成功！', status: 200, data: data['_doc'] })
    }).catch(() => {
      return res.send({ msg: 'error', status: 500 })
    })


  })


})


//获取公告列表（这边就不做分页处理了）   
router.get('/getNoticeList', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }
    let list
    notice.getNoticeList().then((data) => {
      list = data
      return fss.read('./rootinfo/notice.json')
    }).then((data) => {
      let result = JSON.parse(data.toString())
      if (result.nowIsshowNotice == true) {
        return result
      } else {
        return false
      }
    }).then((data) => {
      return res.send({ msg: 'getNoticeList is success', list, notice: data, status: 200 })
    }).catch((err) => {
      return res.send({ msg: 'getNoticeList is fail', err, status: 500 })
    })

  })

})


//删除公告
router.post('/delNotice', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }
    notice.delNotice(req.body.arr).then(() => {
      return res.send({ msg: '删除公告成功！', status: 200 })
    }).catch((err) => {
      return res.send({ msg: '删除公告失败！', err, status: 500 })
    })


  })

})

//查看公告详情
router.get('/getNoticeInfoById', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }
    let id = req.query.id
    let htmlData
    let markdownData
    let NoticeData
    notice.getNoticeInfoById(id).then((data) => {
      NoticeData = data
      return fss.read(NoticeData.contUrl)
    }).then((htdata) => {
      htmlData = htdata
      return fss.read(NoticeData.markdownUrl)
    }).then((mkdata) => {
      markdownData = mkdata
      return
    }).then(() => {
      NoticeData._doc.htmlData = htmlData
      NoticeData._doc.markdownData = markdownData
      return res.send({ msg: 'getNoticeInfo is success', data: NoticeData })
    }).catch((err) => {
      return res.send({ msg: 'getNoticeInfo is fail', err, status: 500 })
    })


  })
})


//启用一个公告
router.post('/startNotice', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }

    //如果存在计划任务，则先取消
    if (global.job) {
      global.job.cancel()
    }
    let noticeInfo = req.body

    let myDate = new Date();
    let expiresN = myDate.setDate(myDate.getDate() + parseInt(noticeInfo.duration));
    let day = dayjs(new Date(expiresN)).format("YYYY-MM-DD HH:mm:ss");

    fss.read('./rootinfo/notice.json').then((data) => {
      let result = JSON.parse(data.toString())
      result.nowIsshowNotice = true
      result.expires = day
      result.noticeId = noticeInfo._id
      result.htmlUrl = noticeInfo.contUrl
      result.startTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
      return result
    }).then((data) => {
      return fss.write('./rootinfo/notice.json', JSON.stringify(data))
    }).then(() => {
      //启用计划任务，在过期时间到达时将notice.json中的nowIsshowNotice改为false
      plan.set(day)
      return res.send({ msg: `公告启用成功，该公告会在${noticeInfo.duration}天后失效！`, status: 200 })
    }).catch((err) => {
      return res.send({ msg: "服务器错误", err, status: 500 })
    })

  })

})


//停用公告
router.post('/stopNotice', (req, res) => {

  let userToken = req.headers.authorization
  let checkResult = token.checkToken(token, userToken, (data) => {
    if (data.status === 400) {
      return res.send(data)
    }
    //如果存在计划任务，则先取消并修改json里的值
    fss.read('./rootinfo/notice.json').then((data) => {
      let result = JSON.parse(data.toString())
      if (result.nowIsshowNotice == true) {
        result.nowIsshowNotice = false
        return result
      } else {
        res.send({ msg: '当前不存在计划任务', status: 201 })
        return false
      }
    }).then((data) => {
      if (data != false) {
        return fss.write('./rootinfo/notice.json', JSON.stringify(data))
      } else {
        return false
      }
    }).then((data) => {
      if (data != false) {
        if (global.job) {
          global.job.cancel()
        }
        return res.send({ msg: '计划任务已停用', status: 200 })
      }
    }).catch((err) => {
      return res.send({ msg: '服务器错误，计划任务停止失败', err, status: 500 })
    })

  })
  
})


//首页请求公告
router.get('/homeNotice', (req, res) => {
  fss.read('./rootinfo/notice.json').then((data) => {
    let result = JSON.parse(data.toString())
    if (!result.nowIsshowNotice) {
      res.send({ msg: "未开启公告", status: 201 })
      return false
    } else {
      return fss.read(result.htmlUrl)
    }
  }).then((data) => {
    if (data == false) {
    } else {
      res.send({ msg: "公告信息获取成功", status: 200, data })
    }
  }).catch((err) => {
    res.send({ msg: "公告信息获取失败", err, status: 500 })
  })
})

module.exports = router