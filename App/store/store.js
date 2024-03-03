import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		integralList: [
			{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				integral:"3"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				integral:"2"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				integral:"1"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				integral:"3"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				integral:"3"
			}
		],
		integralRateList:[
			{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},{
				area:"打扫10栋",
				date:"2021.12.13-2021.12.14",
				status:"正常"
			},
		],
		collegeList: [],
		collegeId: {},//选择的学院
		userInfo: {},//用户信息
		voluntaryList:[],//志愿活动列表
		rankingList:[], //积分排行列表
		commentsList:[], //评论列表
		foundList:[],  //寻物启事列表
		lostList:[],     //失物招领列表
		newFoundList:[], //新的寻物启事列表
		newLostList:[], //新的失物招领列表
		recommentCommentsList:[],//推荐活动评论列表
		chooseList:{},//周几列表
		passwordLength: '',
		passwordLength: '',
		listJoinActivity: '',	// 我参加的所有活动
		comments:[],
		taskList: "",//打扫任务列表
		myActivityList: "",//保存的我的志愿活动
		checkList:[]//检查列表
	},
	//同步方法
	mutations: {
		// 保存学院信息
		college(state, params) {
			state.collegeList = params;
		},
		// 保存选择的学院
		choose(state, params) {
			state.collegeId = params;
		},
		userInfo(state, params) {
			state.userInfo = params;
		},
		//保存的志愿活动列表
		voluntaryList(state, params) {
			state.voluntaryList = params;
		},
		//保存的积分排行列表
		rankingList(state, params) {
			state.rankingList = params;
		},
		//保存的评论列表
		commentsList(state, params) {
			state.commentsList = params;
		},
		//保存寻物启事列表
		foundList(state, params) {
			state.foundList = params;
		},
		//保存失物招领列表
		lostList(state, params) {
			state.lostList = params;
		},
		//保存新的寻物启事列表
		newFoundList(state, params){
			state.newFoundList = params;
		},
		//保存新的失物招领列表
		newLostList(state, params){
			state.newLostList = params;
		},
		//保存的推荐活动的评论列表
		recommentCommentsList(state, params){
			state.recommentCommentsList = params;
		},
		//保存失物招领寻物启事的评论列表
		comments(state, params) {
			state.comments = params;
		},
		//保存的选择周几列表
		chooseList(state, params){
			state.chooseList = params;
		},
		//保存的打扫任务列表
		taskList(state, params){
			state.taskList = params;
		},
		passwordLength(state, params) {
			state.passwordLength = params;
		},
		listJoinActivity(state, params) {
			state.listJoinActivity = params;
		},
		//保存的我的志愿活动
		myActivityList(state,params){
			state.myActivityList = params
		},
		//保存检查列表
		checkList(state,params){
			state.checkList = params
		}
	},
	// 异步方法
	actions: {
		SET(context, Object) {
			//处理异步操作
			context.commit('SET_TOKEN', Object);
			//  console.log(Object);
		}

	}
})
