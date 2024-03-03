const mongoose = require('mongoose')
const Redis = require('ioredis');
mongoose.connect('mongodb://localhost:27017/rebuildAPI', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // "user":"chihiro1003",
    // "pass":"cjq.15672602265"
})
const db = mongoose.connection
db.on('error', err =>{
    console.error(err)
})
db.once('open',() =>{
    console.log('数据库连接成功')
})
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  password: 'chihiro1013'
})
module.exports = {
    redis:redis,
    Users:mongoose.model('User',require('./Users')),
    Tasks:mongoose.model('Task',require('./Tasks')),
    Signs:mongoose.model('Sign',require('./Signs')),
    Losts:mongoose.model('Lost',require('./Losts')),
    Configs:mongoose.model('Config',require('./Configs')),
    Conditions:mongoose.model('Condition',require('./Conditions')),
    Classes:mongoose.model('Classe',require('./Classes')),
    Buildings:mongoose.model('Building',require('./Buildings')),
    Areas:mongoose.model('Area',require('./Areas')),
    Admins:mongoose.model('Admin',require('./Admin')),
    Activities:mongoose.model('Activity',require('./Activities')),
    Academies:mongoose.model('Academy',require('./Academies')),
    Checks:mongoose.model('Check',require('./Checks')),
    Comments:mongoose.model('Comment',require('./Comments'))
}