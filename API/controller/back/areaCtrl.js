const areaUtil = require('../../util/areaUtil')
exports.getArea = async (req,res) => {
    let data = await areaUtil.getArea()
    res.status(200).json({
        msg:data ? '获取成功' : '获取失败',
        data
    })
}
exports.addBuilding = async (req,res) => {
    let data = await areaUtil.addBuilding(req.body.buildingName)
    res.status(200).json({
        msg:data ? '添加成功' : '添加失败',
        data
    })
}
exports.removeBuilding = async (req,res) => {
    console.log(req.body)
    let data = await areaUtil.removeBuilding(req.body.removeBid.toString())
    res.status(200).json({
        msg:data ? '删除成功' : '删除失败',
        data
    })
}
exports.addRoom = async (req,res) => {
    let data = await areaUtil.addRoom(req.body.bid.toString(),req.body.roomName)
    res.status(200).json({
        msg:data ? '添加成功' : '添加失败',
        data
    })
}
exports.removeRoom = async (req,res) => {
    let data = await areaUtil.removeRoom(req.body.rid.toString())
    res.status(200).json({
        msg:data ? '删除成功' : '删除失败',
        data
    })
}