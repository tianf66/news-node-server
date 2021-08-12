
/***************************************************************/
// 创建一个对象来保存应用启动时的初始状态
const state = {
    channleList: new Array(),
};

import actions from './actions.js';
import mutations from './mutations.js';

export default {
  state,
  mutations,
  actions,
};
