// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// self._cleanup(false);
import 'es6-promise/auto';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex/index.js';
import axios from 'axios';
import '@/utils/logger.js';
import utils from '@/utils';
import storage from '@/utils/storage.js';
import dataCenter from '@/store/index';
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

// utils.loadScript("//s.opfed.com/news/clipboard.js", false, () => {
//     let time = new Date().getTime();
//     utils.loadScript(`//s.opfed.com/news/newClip.js?t=${time}`, false);
// });

// 获取频道及广告配置信息
let navInfo = window.config;
store.dispatch('setNavInfo', {
    navInfo
});

router.beforeEach((to, from, next) => {
  if(to.name == 'channel' && !to.query.first) {
    let query = to.query, params = to.params;
    query.first = 'off';
    storage.set('first', 'off');
    //推啊SDK 埋个storage
    storage.setSession('TUIAOPENSCREEN', true);
    router.replace({name: to.name, params, query});
    let data = {
          id: store.state.common.channels[0].code,
          title: store.state.common.channels[0].title,
          type: 'channel',
          pos: 'list'
       }
    if(to.query.appDownloadSourceId) {
        data.app_source = to.query.appDownloadSourceId ? to.query.appDownloadSourceId : 'other';
    }
    OUPENGLOGGER({//入口统计
       action: 'first_load',
       payload: data
    });
  }
  next();
});

let getCode = (id) => {
  let code = '';
  let data = store.state.common.channels;
    for(let cid in data) {
        if(id == data[cid].id)
        code = data[cid].code;
    }
  return code;
}

let getTitle = (id) => {
  let title = '';
  let data = store.state.common.channels;
  for(let cid in data) {
      if(id == data[cid].id)
          title = data[cid].title;
  }
  return title;
}

utils.domReady(() => {

  setTimeout(() => {
    if(storage.getSession('RETURNHOME')) return;//去除发送刷新日志;
    let params = router.history.current.params;
      OUPENGLOGGER({
       action: 'refresh',
       payload: {
          id: getCode(params.cid),
          title: getTitle(params.cid),
          type: 'channel',
          pos: router.history.current.name
       }
    });
  }, 2000);
});

/* 进入页面埋点时间戳*/
dataCenter.getSystemInfo().then((currentTime) => {
  storage.set('systemInfo', currentTime);
});

/* 进入页面埋点用户信息*/
if(!storage.get('soso')) {
  dataCenter.getUserInfo().then((data) => {
    storage.set('soso', data);
  });
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
