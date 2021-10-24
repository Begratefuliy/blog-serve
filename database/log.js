// 更新日志处理模块
const Log = require('./schema/logConstruction')

//添加日志
exports.addLog = (data) => {
    return new Log({time:data.time,type:data.type,cont:data.cont}).save()
}

//获取日志
exports.getLogList = () => {
    return Log.find()
}

