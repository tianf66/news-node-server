import Vue from 'vue';
import store from '../vuex/index.js';
import Router from 'vue-router';
import Channel from '@/components/views/Channel/Channel.vue';
import Detail from '@/components/views/Detail/Detail.vue';

Vue.use(Router);
store.commit({
  type: 'SETCHANNELINFO',
  payload: {channels: config.channelList}
})

let channels = store.state.common.channels;
let upstream = config.newsApiUpstream;
let data = upstream == 'oupeng' || upstream == '' ? channels[0].id : '推荐';
//定制渠道内容默认返回热门频道
if(config.did == '1197043123285082112') data = '1136237795019329536';
if(config.did == '1209739253827522560') data = '1202881216567177216';

export default new Router({
  mode: 'history',
  routes: [
  	{
      path: '*',
      redirect: `/channel/cid/${data}`
    },
    {
      path: '/channel/cid/:cid/',
      name: 'channel',
      component: Channel
    },
    {
      path: '/detail/cid/:cid/tid/:tid',
      name: 'detail',
      component: Detail
    }
  ]
})
