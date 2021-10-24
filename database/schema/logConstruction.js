// 更新日志模型
const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const log = new Schema({
    time: { type: String, required: true },
    type: { type: String, required: true },
    cont: { type: String, required: true }
})


const Log = mongoose.model('Log', log)



module.exports = Log


