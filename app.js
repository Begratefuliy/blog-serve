const express = require('express')
const index = require('./router/index')
const home = require('./router/home')
const about = require('./router/about')
const getPhoto = require('./router/getPhoto')
const login = require('./router/login')
const comment = require('./router/comment')
const leaveMessage = require('./router/leaveMessage')
const enterCms = require('./router/enterCms')
const uploadimg = require('./router/cms/uploadimg')
const delimg = require('./router/cms/delImg')
const fb = require('./router/cms/FbArticle')
const log = require('./router/cms/log')
const recommend = require('./router/cms/recommend')
const delArticle = require('./router/cms/delArticle')
const editArticle = require('./router/cms/editArticle')
const notice = require('./router/cms/notice')
const getLeaveMessage = require('./router/cms/getLeaveMessage')
const sensitive = require('./router/cms/sensitive')
const cors = require('cors')
const bodyParser = require('body-parser')

//执行公告的记时任务
// const plan = require('./plan/noticePlan')

const mongoose = require('mongoose')
//连接数据库
mongoose.connect('mongodb://localhost/blogs', { useMongoClient: true })
mongoose.Promise = global.Promise;

const app = express()

app.use('/uploadimg/', express.static('./uploadimg/'))
app.use('/userimg/', express.static('./userimg/'))
app.use('/rootimg/', express.static('./rootimg/'))
app.use('/photo/', express.static('./photo/'))
// app.use(express.static('./dist'))
//通过该指令可以实现开放当前目录下public目录里所有文件，通过/public/这个url来访问

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/home',home)
app.use('/about',about)
app.use('/login',login)
app.use('/uploadimg', uploadimg)
app.use('/fb',fb)
app.use('/delArticleById', delArticle)
app.use('/editArticle', editArticle)
app.use('/enterCms', enterCms)
app.use('/delimg', delimg)
app.use('/comment', comment)
app.use('/leaveMessage', leaveMessage)
app.use('/getLeaveMessage', getLeaveMessage)
app.use('/getPhoto', getPhoto)
app.use('/recommend', recommend)
app.use('/log', log)
app.use('/notice', notice)
app.use('/sensitive', sensitive)




app.listen(5000, () => console.log('running'))