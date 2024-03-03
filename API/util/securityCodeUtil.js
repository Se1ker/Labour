const nodeemailer = require('nodemailer');
const { redis } = require('../model')
// 发送者邮箱
const userEmail = '2638420181@qq.com'
// 发送者授权码
const userPass = 'dzorpfcbddaodhje'
// 配置
const transporter = nodeemailer.createTransport({
    host: "smtp.qq.com",						// QQ邮箱的SMTP地址
    // host: "smtp.163.com",						// 网易邮箱的SMTP地址
    // host: "smtpdm.aliyun.com",// 阿里云的邮件地址
    port: 465,									// 每个邮箱的端口号可能是一样的，一般都使用465，但有些公司使用的就不是465
    secureConnection: false, // 是否使用 SSL
    auth: {
        "user": userEmail, 		// 你自己的邮箱的邮箱地址
        "pass": userPass       // 授权码（不是邮箱密码）
    }
});
// 随机生成六位验证码
const emailCode = (function captchaNumber() {
    let num = [];
    for (let i = 0; i < 6; i++) {
        num[i] = parseInt(Math.random() * 10);
    }
    return num.join('');
})()
// 邮件内容
const email = {
    title: '邮箱验证码',
    body: `
<h1>您好：</h1>
<p style="font-size: 18px;color:#000;">
    您的验证码为：
    <span style="font-size: 16px;color:#f00;"> ${emailCode}， </span>
    验证码告知他人将会导致数据信息被盗，请勿泄露
</p>
`
}
// 调用
/**
 * 
 * @module securityCode 验证码工具 
 */
/**
 * @method send  发送验证码到 toEmail 邮箱
 * @param {String} email 发送对象的邮箱号
 */
exports.send = async (toEmail) => {
    const emailCotent = {
        from: userEmail,
        to: toEmail,
        "subject": email.title, // 邮件标题
        "html": email.body // 邮件内容
    };
    await redis.set(toEmail, emailCode, 'EX', 300)
    transporter.sendMail(emailCotent, async function (error, info) {
        if (error) {
            throw new Error(error)
        }
    });
}

/** 
* @method compCode  比对验证码
* @param {String} toEmail 发送对象的邮箱号
* @param {String} code 用户输入的验证码
*/

exports.compCode = async (toEmail, code) => {
    const aimCode = await redis.get(toEmail)
    return code === aimCode
}
