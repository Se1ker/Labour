// 把封装好的 axios 引入
import http from '../utils/https';
// 创建一个业务接口对象
const admin = {
  login(params) {
    return http.post('/saLogin', params)
  }
}
const info = {
  getAllUser(params) {
    return http.get('/getAllUser', { params })
  },
  getAllChecker() {
    return http.get('/getAllChecker')
  },
  modifyUserInfo(params) {
    return http.post('/back/modifyUserInfo',params)
  },
  listAcademy(){
    return http.get('/listAcademy')
  },
  listAllClass(){
    return http.get('/listAllclass')
  },
  deleteUser(params){
    return http.post('/deleteUser',params)
  }
}
const area = {
  getAreaList() {
    return http.get('/getArea')
  },
  addRoom(params) {
    return http.post('/addRoom', params)
  },
  removeRoom(params) {
    return http.post('/removeRoom', params)
  },
  addBuilding(params) {
    return http.post('/addBuilding', params)
  },
  removeBuilding(params) {
    return http.post('/removeBuilding', params)
  }
}
const conditions = {
  getConditions() {
    return http.get('/getConditions')
  }
}
const check = {
  setCheck() {
    return http.get('/setCheck')
  },
  getCheckList() {
    return http.get('/getCheckList')
  },
  listChosen() {
    return http.get('/listChosen')
  },
  getCheckCount() {
    return http.get('/getCheckCount')
  },
  modifyCheckCount(params) {
    return http.post('/modifyCheckCount', params)
  }
}
const task = {
  list() {
    return http.get('/getTaskList')
  },
  setCleanConfig() {
    return http.get('/setCleanConfig')
  },
  getCleanConfig() {
    return http.get('/getCleanConfig')
  },
  distribute(params) {
    return http.post('/distribute',params)
  }
}
const activity = {
  list(params) {
    return http.get('/back/listActivity',{params})
  },
  check(params) {
    console.log(params)
    return http.post('/checkActivity', params )
  },
  checkDone(params) {
    return http.post('/checkDone', params)
  }
}
export default { admin, info, area, conditions, check, task, activity }
