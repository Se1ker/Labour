const express = require('express');
require('express-async-errors'); // 异步错误捕获支持 https://github.com/davidbanham/express-async-errors
const app = express();
const path = require('path');
const errorHandler = require('./middleware/error-handler');
app.use(express.static(path.join(__dirname, 'uploads')))
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes')
app.use(morgan('dev'))
app.use(express.json());
// 配置跨域
app.use(cors())
require('./model')
app.use('/api/v1', routes)
// 挂载统一处理错误中间件
app.use(errorHandler())
app.listen(3000, () => {
  console.log('serve is running at http://localhost:3000')
})

