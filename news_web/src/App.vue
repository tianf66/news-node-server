<template>
  <div id="app">
    <keep-alive>
      <router-view class="view"></router-view>
    </keep-alive>
    <back-top></back-top>
    <!-- 浮标广告渠道定制（已下线） -->
    <!-- <const-float-ad></const-float-ad> -->
    <!--  浮标广告渠道定制（已下线）end-->

    <!-- 开屏（非自渲染）广告 -->
    <ads-block v-if="ads.openscreen && ads.openscreen.id && isOpenScreen" :aid="ads.openscreen.id" :clickCount="ads.openscreen.adClickTime" :immediate="true" :adsType="'openscreen'"></ads-block>
    <!-- 开屏（非自渲染）广告 end -->

    <!-- 开屏（自渲染）广告 -->
    <div @touchmove.prevent class="openscreen-adpop" v-if="isPopAdLayer && isShowAdsPopDerself && ads.openscreenRenderself && ads.openscreenRenderself.id && isOpenScreen">
      <div class="close-ad" @click="closePopAd">+</div>
      <ads-block class="adpop" :adsType="'openscreenRenderself'" :clickCount="ads.openscreenRenderself.adClickTime" :aid="ads.openscreenRenderself.id" :immediate="true"></ads-block>
    </div>
    <!-- 开屏（自渲染）广告 end -->

    <!-- 浮标广告 -->
    <div class="ad-float"  v-if="ads.buoy && ads.buoy.id">
      <ads-block :aid="ads.buoy.id" :immediate="true" :adsType="'buoy'" :clickCount="ads.buoy.adClickTime"></ads-block>
    </div>
    <!-- 浮标广告 end -->

    <div class="record-number" v-if="recordText" :class="pcAndMobile == 'pc' ? 'record-pc': ''">
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_block">{{recordText}}</a>
    </div>

    <div id="app"></div>
  </div>
</template>

<script>
import BackTop from '@/components/modules/BackTop.vue';
import AdsBlock from '@/components/ads/AdsBlock.vue';
import storage from '@/utils/storage.js';
// import constFloatAd from '@/components/modules/constFloatAd.vue';
export default {
  	name: 'App',
  	components: {
        BackTop,
        AdsBlock,
        // constFloatAd
  	},
    data() {
      return {
        isShowAdsPopDerself: true,
        recordText: "",
        pcAndMobile: ""
      }
    },
    computed: {
      params() {
        return this.$route.params;
      },
      query() {
        return this.$route.query;
      },
      ads() {
        return this.$store.state.common.adConfig;
      },
      isOpenScreen() {
        return storage.get('first')
      },
      isPopAdLayer() {
        return this.$store.state.common.isPopAdLayer;
      }
    },
    mounted() {

      this.$nextTick(() => {
        storage.remove('first');
      });

      this.pcAndMobile = navigator.userAgent.toLowerCase().indexOf('mobile') > -1 ? 'mobile' : 'pc';
      if(location.host.indexOf('fonews.cn') > -1) this.recordText = '京ICP备20015773号-2';
    },
    methods: {
      closePopAd() {
        this.isShowAdsPopDerself = false;
      }
    }
}
</script>

<style lang="scss">
@import '../static/scss/base.css';
.record-number {
    font-size: 0.14rem;
    text-align: center;
    margin-bottom: 0.1rem;
}
.record-pc {
    width: 100%;
    position: fixed;
    bottom: 1px;
    z-index: 99999;
    margin: 0 auto;
}
.ad-float {
  position: fixed;
  bottom: 1.7rem;
  z-index: 9999;
  right: 0;
  width: .6rem;
}
.openscreen-adpop {
  width: 100%;
  height: 100%;
  z-index: 99;
  display: table;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  .adpop {
    display:table-cell;
    vertical-align:middle;
  }
  .close-ad {
    position: absolute;
    /* right: 46%;
    top: 50%; */
    top: 12px;
    right: 12px;
    font-size: 40px;
    color: #fff;
    transform: rotate(-45deg);
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
