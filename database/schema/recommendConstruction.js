//推荐阅读数据模型
const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const recommend = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
})


const Recommend = mongoose.model('Recommend', recommend)



module.exports = Recommend


