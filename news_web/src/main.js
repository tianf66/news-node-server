// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// self._cleanup(false);
import 'es6-promise/auto';
import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import store from './vuex/index.js';
import axios from 'axios';
import '@/utils/logger.js';
import utils from '@/utils';
import storage from '@/utils/storage.js';
import dataCenter from '@/store/index';
import VueWechatTitle from 'vue-wechat-title';
import routes from './router/index.js';
Vue.use(VueWechatTitle);
Vue.use(Router);
// utils.loadScript("//s.opfed.com/news/clipboard.js", false, () => {
//     let time = new Date().getTime();
//     utils.loadScript(`//s.opfed.com/news/newClip.js?t=${time}`, false);
// });


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

/*utils.domReady(() => {

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
});*/

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

//启动App
function startRouter() {
  /**   映射路由 返回的第一个模块 start  */
  routes.unshift({
      path: '*',
      redirect: `/channel/cid/${config.channelList[0].id}`,
  });
  /** end */

  /* 路由初始化 start*/
	let router = new Router({
	  mode: 'history',
	  routes,
	});
	/* 路由初始化 end */

  router.beforeEach((to, from, next) => {
    if(to.name == 'channel' && !to.query.first) {
      let query = to.query, params = to.params;
      query.first = 'off';
      storage.set('first', 'off');
      //推啊SDK 埋个storage
      storage.setSession('TUIAOPENSCREEN', true);
      router.replace({name: to.name, params, query});
      /* let data = {
            id: store.state.common.channels[0].code,
            title: store.state.common.channels[0].title,
            type: 'channel',
            pos: 'list'
         }
      OUPENGLOGGER({//入口统计
         action: 'first_load',
         payload: data
      });*/
    }
    next();
  });

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  });
}

function systemError() {
  let loading = document.getElementById('app');
  if(loading) {
      loading.innerHTML = '系统错误，请点击刷新重试';
      loading.addEventListener('click', () => {
          location.reload();
      });
  }
}

function getQueryVariable(variable)  {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

let did = getQueryVariable('did') || 2;
dataCenter.getAppMenuConfigList({did: did}).then((data) => {
  if(data) {
    // 获取频道及广告配置信息
    let navInfo = data;
    window.config = navInfo;
    store.dispatch('setNavInfo', {
        navInfo
    });
    startRouter();
  }
}, () => {
  // TODO
  systemError();
});
Vue.config.productionTip = false;


