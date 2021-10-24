const jwt = require('jsonwebtoken')
const base = require('../base')

const token = {
    //加密 参数：info 需要加密的信息(对象)  secret 密钥   exp 过期时间
    //返回一个token
    encrypt:(info,secret,exp) => {
        return jwt.sign(info,secret,{expiresIn:exp})
    },

    //解密 参数：token 需要解密的token字符串  secret 密钥
    decode:(token,secret,callback) => {
        jwt.verify(token,secret,callback)
    },

    //查看请求头中是否携带token
    checkToken: (token,userToken,callback) => {
        if (!userToken) {
            return callback({ msg: 'token不存在，请重新登录', status: 400 })
        }
      token.decode(userToken, base.SECRET, (err, data) => {
            if (err) {
                return callback({ msg: 'token存在异常', status: 400 })
            }
            return callback({ msg: 'token正常', status: 200 })
        })
       
        
    }
}

module.exports = token
