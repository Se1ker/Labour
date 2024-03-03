const userUtil = require('../../util/userUtil')
exports.listAcademy = async (req, res, next) => {
    let data = await userUtil.listAcademy()
    console.log(data)
    res.status(200).json({
        msg: '学院列表获取成功',
        data
    })
}