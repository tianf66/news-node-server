
/***************************************************************/
// 创建一个对象来保存应用启动时的初始状态
const state = {
	ads: {},
	popAds: {
		slot: '',
		showPopSlot: false
	},
	styleHeight: ''
};

import actions from './actions.js';
import mutations from './mutations.js';

export default {
	state,
	actions,
	mutations
};
