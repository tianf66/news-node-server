import Channel from '@/components/views/Channel/Channel.vue';
import Detail from '@/components/views/Detail/Detail.vue';

const routes = [
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
];

export default routes;
