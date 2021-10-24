
const User = require('./schema/userConstruction')




//导出添加成员方法
exports.addUser = function addUser(name,password) {
    const newuser = new User({name:name,password:password})
    return newuser.save()
    
}



//导出查询方法
exports.queryUser = function queryUser(name) {
    return User.findOne({name:name})
}

  



