const util = require('util')
module.exports = () => {
    return (err, req, res, next) => {
        console.error(err)
        res.status(500).json({
            msg: '服务器内部错误',
            data: {
                error: util.format(err)
            }
        })
    }
}