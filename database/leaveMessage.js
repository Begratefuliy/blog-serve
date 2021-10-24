const LeaveMessage = require('./schema/leaveMessageConstruction')

//导出添加留言到数据库的方法
exports.addLeaveMessage = (needSaveData,callback) => {

    let newMessage = new LeaveMessage(needSaveData)

    return callback(newMessage.save())



}


//导出获取留言列表方法,参数：isreaded 阅读状态（已读，未读）  callback 回调函数  page 页码  itemNum 每次请求的数量
//状态 205 已经全部获取完  204 表示还有数据
exports.getLeaveMessageList = (page,itemNum,isreaded,callback) => {
    let pageI = parseInt(page)
    let itemNumI = parseInt(itemNum)
   
    LeaveMessage.find({isreaded:isreaded}).then((data) => {
        // 总数据量
        let state = 205
        let total = data.length
        if(total == 0){
            return callback({ msg: '暂无数据', page: pageI, list: [], state: state, total: total })
        }

        if (data.length <= itemNumI ){
            return callback({ msg: '数据获取成功', page: pageI, list: data, state: state,total:total })
        }else{
            data.slice(pageI * itemNumI) <= itemNumI ? state = 205 : state = 204
            let newData = data.slice(pageI * itemNumI, pageI * itemNumI+itemNumI)
            return callback({ msg: '数据获取成功', page: pageI, list: newData, state: state, total: total})
        }
       
    }).catch((err) => {
        return callback({ msg: '数据获取失败', err:err })

    })


}


//修改评论的阅读状态
exports.changeReaded = (id,callback) => {
    return callback(LeaveMessage.updateOne({ _id: id }, {isreaded:true}))
}


//删除留言
exports.delMessageById = (id) => {
    return LeaveMessage.remove({_id:id})
}
