//将文件读写相关的操作封装成promise

const fs = require('fs')

let read = (path) => {
    return new Promise((resolve,reject) => {
        fs.readFile(path,'utf-8',(err,data) => {
            if(err){
              return  reject(err)
            }
            resolve(data)
        })
     
    })
}


let write = (path,data) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(path,data,(err) => {
            if(err){
               return reject(err)
            }
            resolve({msg:'write is ok',code:200})
        })
    })
}


//追加文件内容
let addfile = (path,data) => {
   return new Promise((resolve,reject) => {
       fs.appendFile(path, data, (err) => {
        if(err){
            return reject(err)
        }
        resolve({msg:'ok',code:200})
       })
   }
   )
}


//删除文件
let delfile = (path) => {
    return new Promise((resolve,reject) => {
        fs.unlink(path,(err) => {
            if(err){
                return reject(err)
            }
            resolve({msg:'ok',code:200})
        })
    })
}



exports.read = read
exports.write = write
exports.addfile = addfile
exports.delfile = delfile