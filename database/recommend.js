// 文章推荐
const Recommend = require('./schema/recommendConstruction')

//添加文章推荐
exports.addRecommend = (data) => {
    return new Recommend(data).save()
}

//获取文章推荐
exports.getList = () => {
    return Recommend.find()
}

//删除文章推荐
exports.del = (arr) => {
    return Recommend.deleteMany({ _id: { $in:arr} }
)

}