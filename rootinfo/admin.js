const fss = require('../tools/fss')

exports.getAdminInfo = (callback) => {

  fss.read('./rootinfo/admin.json').then((data) => {
    let obj = JSON.parse(data)
    return callback(obj)
  }).catch((err) => {
   callback({
      "username": "admin",
      "userpassword": "123456",
      "userimg": "rootimg/root.jpg"
    })
  })

}
