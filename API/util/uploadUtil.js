// exports.uploadImage = async (params, type) => {
//     // 通过 inspirecloud.file.upload 接口实现上传
//     const { mimetype } = params;
//     const { url } = await inspirecloud.file.upload(
//         params.originalname,    // 文件名
//         params.buffer,// 文件内容
//         {
//             mimetype,   // 文件类型，不传则会根据文件后缀名自动识别
//         }
//     );
//     return url;
// }
const multer = require("multer");
exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            // fieldname是表单的name值，也就是我们设定的“logo”，
            // originalname是文件上传时的名字，可以根据它获取后缀，
            // encoding，mimetype 我就不详细介绍了，可以自行输出查看。
            // const { fieldname, originalname, encoding, mimetype } = file
            // const after = originalname.split('.')[1] ? '.' + originalname.split('.')[1] : '.jpg'
            // cb(null, fieldname + after);
            cb(null, `${file.originalname}`) 
        }
    })
})
