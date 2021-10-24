// 公告模块的计划任务

//问题：如果多次启用，则会添加多个计划任务

const schedule = require('node-schedule');
const fss = require('../tools/fss')
const sd = require('silly-datetime');

function setPlan(time) {

  //不加关键词定义，将job存放到全局对象中
     job = schedule.scheduleJob(time, function () {
    fss.read('./rootinfo/notice.json').then((data) => {
      let result = JSON.parse(data.toString())
      result.nowIsshowNotice = false
      return result
    }).then((data) => {
      return fss.write('./rootinfo/notice.json', JSON.stringify(data))
    }).then(() => {
      //取消定时，等待下一次执行
      job.cancel()
    }).catch((err) => {
      //记录错误日志
      let fktime = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
      let jl = err + ":" + fktime + '\n'
      fss.addfile('./plan/err.log', jl)
      return err
    })
  });
}

let plan = {
  // job:job,
  set:setPlan
}

module.exports = plan











