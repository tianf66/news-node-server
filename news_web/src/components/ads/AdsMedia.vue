<template>
<div class="x-mediaslot" :style="ads.subtype == 1 ? 'margin: 0 0.1rem 0rem;overflow: hidden;':''" @click="clkTrack">
    <banner v-if="ads.type == 2" :ads="ads"></banner>
    <info v-if="ads.type == 3" :ads="ads"></info>
    <inscreen v-if="ads.type == 9" :ads="ads"></inscreen>
    <html-frame v-if="ads.type == 10" :ads="ads" :active="active" :adsType="adsType" :adMaskShow="adMaskShow" :clickCount="clickCount"></html-frame>
    <info-banner v-if="ads.type == 12" :ads="ads"></info-banner>
    <multi v-if="ads.type == 21" :ads="ads"></multi>
    <flot-point v-if="ads.type == 14" :ads="ads"></flot-point>
</div>
</template>
<script>
import Banner from '@/components/ads/item/AdsBanner.vue';
import Info from '@/components/ads/item/AdsInfo.vue';
import Multi from '@/components/ads/item/AdsMulti.vue';
import Inscreen from '@/components/ads/item/AdsInScreen.vue';
import HtmlFrame from '@/components/ads/item/AdsFrame.vue';
import InfoBanner from '@/components/ads/item/AdsInfoBanner.vue';
import FlotPoint from '@/components/ads/item/AdsFlotPoint.vue';
import imgTrack from '@/components/ads/imgTrack.js';

export default {
    name: 'AdsMedia',
    components:{
        FlotPoint,
        Banner,
        Info,
        Multi,
        Inscreen,
        HtmlFrame,
        InfoBanner,
        FlotPoint
    },
    props: {
        ads: {
            type: Object,
            default() {return {};}
        },
        active: Boolean,
        immediate: Boolean,
        adsType: String,
        type: '',
        clickCount: String
    },
    data() {
        return {
           sendedPV: false,
           sendedDetailPV: false,
           adMaskShow: false,
           completed: false
        };
    },
    watch: {
        '$route': function(_new, _old) {
            if(_new.name == 'detail' && _old.name == 'channel' && this.type == 'detail') {
                if(this.immediate) {
                    this.imgTrack();
                    this.adMaskShow = true;
                } else {
                    this.sendDetailPV();
                    window.addEventListener('scroll', this.sendDetailPV);
                }
            }
            if(_new.name == 'detail' && _old.name == 'detail' && this.type == 'detail') {
                if(this.immediate) {
                    this.imgTrack();
                    this.adMaskShow = true;
                } else {
                    this.sendDetailPV();
                    window.addEventListener('scroll', this.sendDetailPV);
                }
            }
            if(_new.name == 'channel' && _old.name == 'channel') {
                if(this.immediate) {
                    this.imgTrack();
                    this.adMaskShow = true;
                } else {
                    this.$nextTick(() => {
                        this.sendPV();
                        window.addEventListener('scroll', this.sendPV);
                    });
                }
            }
        }
    },
    computed: {
        name() {
            return this.$route.name;
        }
    },
    mounted() {
        //渲染完成后上报
        this.$nextTick(function () {
            this.completed = true;
        });

		if(this.immediate) {
			this.imgTrack();
            this.adMaskShow = true;
		} else {
            if(this.name == 'channel') {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.sendPV();
                        window.addEventListener('scroll', this.sendPV);
                    }, 3000);
                });
            }
            if(this.name == 'detail') {
                this.sendDetailPV();
                window.addEventListener('scroll', this.sendDetailPV);
            }
		}
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.sendPV);
        window.removeEventListener('scroll', this.sendDetailPV);
    },
    methods: {
        sendPV() {
            if(this.sendedPV) {
                window.removeEventListener('scroll', this.sendPV);
                this.sendedPV = false;
                return;
            }
            let $el = this.$el;
            let offsetViewTop = $el.getBoundingClientRect().top;
            // console.log(this.completed, offsetViewTop <= window.innerHeight);
            if(offsetViewTop <= window.innerHeight && this.name !== 'detail') {
                this.$nextTick(() => {
                    this.imgTrack();
                    this.adMaskShow = true;
                });
            }

        },
        sendDetailPV() {
            if(this.sendedDetailPV) {
                window.removeEventListener('scroll', this.sendDetailPV);
                this.sendedDetailPV = false;
                this.adMaskShow = true;
                return;
            }
            let $el = this.$el;
            let offsetViewTop = $el.getBoundingClientRect().top;
            // console.log($el, offsetViewTop <= window.innerHeight, offsetViewTop);
            if(this.completed && offsetViewTop <= window.innerHeight && this.name == 'detail') {
                this.$nextTick(() => {
                    this.imgTrack();
                    this.adMaskShow = true;
                });
            }

        },
        imgTrack() {
			this.sendedPV = true;
            this.sendedDetailPV = true;
            let impr = this.ads.impr_track;
            if(impr) {
                if(this.ads.subtype == 11 || this.ads.subtype == 10 || this.ads.subtype == 19) {
                    this.getAdLogger('ad_show');
                }
                imgTrack(impr);
            }
        },
        clkTrack() {
            let clk = this.ads.clk_track;
            if(clk){
                if(this.ads.subtype == 11) {
                    this.getAdLogger('ad_click');
                }
                imgTrack(clk);
            }
        },
        getAdLogger(action) {
            let data = {
                "ads_id": this.adsType,
                "type": this.ads.subtype == 11 ? 'huoyan' : 'baidu',
                "ip": ip,//html页面中的全局对象
                "slot_id": this.ads.slot,
                "ad_status": 'normal'
            };
            OUPENGLOGGER({
                action,
                payload: data
            });
        }
    }
};
</script>

<style>
.__ximg__ {
    width: 100%;
}
.x-mediaslot {
    /* background-color: #fff; */
}
.x-tips {
    position: absolute;
    left: 0.05rem;
    bottom: 0.05rem;
    padding: 0 0.03rem;
    font-size: 0.12rem;
    color: #fff;
    background-color: rgba(0, 0, 0, .3);
}
</style>
