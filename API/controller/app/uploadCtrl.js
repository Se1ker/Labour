
exports.upload = async (req,res,next) => {
    res.status(200).send(`http://175.27.247.87:8081/${req.file.filename}`)
}