//留言板数据模型
// 设置用户信息的集合模型
const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const leaveMessage = new Schema({
    emil: { type: String },
    info: { type: String, required: true },
    isreaded:{type:Boolean},
    time:{type:String}

})


const LeaveMessage = mongoose.model('LeaveMessage', leaveMessage)



module.exports = LeaveMessage


