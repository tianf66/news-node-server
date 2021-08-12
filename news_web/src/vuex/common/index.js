
/***************************************************************/
// 创建一个对象来保存应用启动时的初始状态

import actions from '@/vuex/common/actions.js';

const state = {
	channels: [],
  adConfig: {},
  xiGuangChannels: [],
  isPopAdLayer: true
};

const mutations = {
	SETCHANNELINFO(state, {payload: {channels}}) {
      if(channels) {
        // channels.sort((a, b) => a.s > b.s);
        /*时尚 1139407902793011200
        娱乐 1138359174262951936
        饮食 1139410675634802688
        育儿 1188642728401530880*/
        let channelsArray = [];
        let costIds = ['1139407902793011200', '1138359174262951936', '1139410675634802688', '1188642728401530880'];
        let costId = costIds[Math.floor(Math.random() * costIds.length)];

        channels.forEach((item, index) => {
          if(item.id == costId) {
            channelsArray.unshift(item);
          } else {
            channelsArray.push(item);
          }
        });

        state.channels = channelsArray;
      }
  },
  SETADSINFO(state, {payload: {adConfig}}) {
    state.adConfig = adConfig;
  },
  SETXIGUANGCHANNELS(state, {payload: {channels}}) {
    if(channels) {
      state.xiGuangChannels = channels;
    }
  },
  SETISPOPADLAYER(state, {isPopAdLayer}) {
    state.isPopAdLayer = isPopAdLayer;
  }
};

export default {
  state,
  actions,
  mutations
};
