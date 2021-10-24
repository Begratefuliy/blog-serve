// 设置用户信息的集合模型
const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const userInfo = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }

})


const User = mongoose.model('User', userInfo)



module.exports = User


