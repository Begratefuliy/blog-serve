const express = require('express')
const router = express.Router()
const sd = require('silly-datetime');

const Article= require('../database/article')
const fs = require('fs')
let fss = require('../tools/fss')
//getArticleList


//获取文章列表数据
router.get('/getArticleList',(req,res) => {


    let type = req.query.type
    let page = req.query.page
    let listNumber = req.query.listNumber
    Article.getArticleList(type,page,listNumber,(data,state) => {
        if(data === 'error'){
            res.json({msg:'error',status:400})
            return
        }
        res.json({msg:'success',status:200,list:data,state:state})
    })
   
   
})



//获取文章信息
router.get('/getArticleData',(req,res) => {

    let fileUrl =  req.query.fileUrl

    //通过
   
    fs.readFile(fileUrl,'utf8',(err,data) => {
        if(err){
            res.json({ msg: '服务器读取文件失败,请检查!',status:400 })
        }else{
            res.json({ msg: 'ok', status: 200, data: data })

        }

    })

    
})





module.exports = router