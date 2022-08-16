<template>
<section class="tuia-box">
    <div :style="styleObj" class="ads-tuia" :id="tuiaUnionId" v-if="tuiaUnionAd"></div>
    <div class="ads-tuia-float" v-if="isFloat" @click="adTuiaClick">
        <img :src="float_imgs" alt="">
    </div>
</section>
</template>

<script>

import utils from '@/utils';
import imgTrack from '../imgTrack.js';
import storage from '@/utils/storage.js';
export default {
    name: 'adsTuiAsdk',
    props: ['ads', 'adsType'],
    data() {
        return {
            tuiaUnionId: '',
            tuiaUnionAd: false,
            styleObj: {},
            isFloat: false,
            float_imgs: ''
        };
    },
    mounted() {

        if(this.adsType == 'buoy') {
            if(!storage.getSession('TUIAOPENSCREEN')) {
                this.isFloatPoint();
            }
        } else {
            utils.loadScript('https://yun.tuisnake.com/h5-mami/activity/native/sdk/index.js', true);
            this.initAdsTuia(true);
        }

    },
    computed: {
        did() {
            return utils.getDID();
        }
    },
    methods: {
        initAdsTuia(openscreen) {
            this.tuiaUnionId = `unTuiaSdk${utils.getUid()}`;
            this.tuiaUnionAd = true;
            this.styleObj.height = `${window.innerHeight}px`;

            let adHtml = JSON.parse(this.ads.html);

            this.$nextTick(() => {
                let options = {// options 详细介绍见JSSDK方法说明
                        appKey: adHtml.appKey,//  必须  系统分配 (在推啊后台‘我的媒体’获取appkey)    
                        slotId: adHtml.slotId,//  必须  系统分配的广告位Id (在推啊后台‘我的广告位’获取 slotId)
                        dom: `#${this.tuiaUnionId}`,//  必须  dom节点
                        debug: false,//  可选  选择是否开启debug模式
                        deviceId: utils.getCookie('news_uid'),//  可选  android传入imea号，ios传idfa，若无法获取请传入 userId 对接大富翁时，必传
                        userId: utils.getCookie('news_uid'),//  可选  用户id，用于对接虚拟奖品，确定用户身份 对接大富翁时， 必传
                        iframeStyle: {
                            iframeHeight: window.innerHeight
                        }
                }
                //加载sdk
                if(openscreen) {
                    window.onload = () => {
                        window.Tsdk.init(options);

                    }
                } else {
                    window.Tsdk.init(options);
                }

                //浮标广告多次点击，需清空DOM
                let el = document.getElementById(this.tuiaUnionId);

                el.innerHeight = '';
                el.style.display = 'block';

                //删除开屏标记
                storage.setSession('TUIAOPENSCREEN', false);
            });
        },
        adTuiaClick() {
            this.tuiaUnionAd = true;
            this.initAdsTuia();
        },
        isFloatPoint() {
            this.tuiaUnionAd = false;
            let num = Math.floor(Math.random()*(1 - 4) + 4);
            this.float_imgs = `//s.opfed.com/news/tuiaAd${num}.gif`;
            utils.loadScript('https://yun.tuisnake.com/h5-mami/activity/native/sdk/index.js', true);
            this.isFloat = true;

        }
    }
};
</script>

<style lang="scss">
.tuia-box {
    width: 100%;
    height: 100%;
}
.ads-tuia {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
}
.ads-tuia-float {
    width: 100%;
    height: 100%;
}
</style>
